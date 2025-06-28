# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from typing import Optional

# Mangum for serverless adaptation
from mangum import Mangum

app = FastAPI(title="OpenAI Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    developer_message: str
    user_message: str
    model: Optional[str] = "gpt-4.1-mini"
    api_key: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        client = OpenAI(api_key=request.api_key)
        async def generate():
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": request.developer_message},
                    {"role": "user", "content": request.user_message}
                ],
                temperature=1.2,
                max_tokens=350,
                stream=True
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        print("ERROR in /api/chat:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Mangum handler for Vercel
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 