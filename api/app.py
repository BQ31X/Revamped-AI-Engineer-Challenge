# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
import tempfile
import asyncio
from typing import Optional, List
import sys

# Add the parent directory to the path to import aimakerspace
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from aimakerspace.text_utils import PDFLoader, CharacterTextSplitter
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.embedding import EmbeddingModel
from aimakerspace.openai_utils.chatmodel import ChatOpenAI

# Initialize FastAPI application with a title
app = FastAPI(title="PDF RAG Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Global storage for PDF databases (in production, use persistent storage)
pdf_databases = {}

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the developer/system
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4o-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication

class RAGChatRequest(BaseModel):
    user_message: str      # Message from the user
    pdf_id: str           # ID of the uploaded PDF to chat with
    model: Optional[str] = "gpt-4o-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication
    k: Optional[int] = 3  # Number of relevant chunks to retrieve

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": request.developer_message},
                    {"role": "user", "content": request.user_message}
                ],
                temperature=1.2,
                max_tokens=350,
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), api_key: str = Form(...)):
    """Upload and index a PDF for RAG chat"""
    try:
        if not api_key:
            raise HTTPException(status_code=400, detail="API key is required")
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Create a temporary file to save the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            # Load and process the PDF
            pdf_loader = PDFLoader(temp_path)
            documents = pdf_loader.load_documents()
            
            if not documents or not documents[0].strip():
                raise HTTPException(status_code=400, detail="PDF appears to be empty or unreadable")
            
            # Split text into chunks
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = text_splitter.split_texts(documents)
            
            # Create embeddings and vector database
            # Set the API key as environment variable for the embedding model
            os.environ['OPENAI_API_KEY'] = api_key
            embedding_model = EmbeddingModel()
            vector_db = VectorDatabase(embedding_model)
            
            # Build vector database from chunks
            vector_db = await vector_db.abuild_from_list(chunks)
            
            # Generate a unique ID for this PDF
            pdf_id = f"pdf_{len(pdf_databases)}_{file.filename.replace('.pdf', '')}"
            
            # Store the vector database
            pdf_databases[pdf_id] = {
                'vector_db': vector_db,
                'filename': file.filename,
                'chunks': chunks
            }
            
            return {
                "pdf_id": pdf_id,
                "filename": file.filename,
                "chunks_created": len(chunks),
                "message": "PDF successfully uploaded and indexed"
            }
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/api/chat-with-pdf")
async def chat_with_pdf(request: RAGChatRequest):
    """Chat with an uploaded PDF using RAG"""
    try:
        # Check if PDF exists
        if request.pdf_id not in pdf_databases:
            raise HTTPException(status_code=404, detail="PDF not found. Please upload a PDF first.")
        
        pdf_data = pdf_databases[request.pdf_id]
        vector_db = pdf_data['vector_db']
        
        # Set API key for embedding model
        os.environ['OPENAI_API_KEY'] = request.api_key
        
        # Retrieve relevant chunks
        relevant_chunks = vector_db.search_by_text(
            request.user_message, 
            k=request.k, 
            return_as_text=True
        )
        
        # Prepare context from relevant chunks
        context = "\n\n".join(relevant_chunks)
        
        # Create system message with context
        system_message = f"""You are a helpful assistant that answers questions based on the provided document context. 
        Use the following context to answer the user's question. If the answer cannot be found in the context, say so.
        
        Context:
        {context}"""
        
        # Initialize chat model
        chat_model = ChatOpenAI(model_name=request.model)
        
        # Create messages for chat
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": request.user_message}
        ]
        
        # Create an async generator for streaming response
        async def generate():
            async for chunk in chat_model.astream(messages):
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/pdfs")
async def list_pdfs():
    """List all uploaded PDFs"""
    return {
        "pdfs": [
            {
                "pdf_id": pdf_id,
                "filename": data["filename"],
                "chunks_count": len(data["chunks"])
            }
            for pdf_id, data in pdf_databases.items()
        ]
    }

@app.delete("/api/pdf/{pdf_id}")
async def delete_pdf(pdf_id: str):
    """Delete an uploaded PDF"""
    if pdf_id not in pdf_databases:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    filename = pdf_databases[pdf_id]["filename"]
    del pdf_databases[pdf_id]
    
    return {"message": f"PDF '{filename}' successfully deleted"}

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
