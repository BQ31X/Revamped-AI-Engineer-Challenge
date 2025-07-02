'use client';

import { useState, useRef } from 'react';
import axios from 'axios';

interface PDF {
  pdf_id: string;
  filename: string;
  chunks_count: number;
}

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [chatMode, setChatMode] = useState<'regular' | 'pdf'>('regular');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdfs = async () => {
    try {
      const response = await axios.get('/api/pdfs');
      setPdfs(response.data.pdfs);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !apiKey) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);

    try {
      const response = await axios.post('/api/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `✅ PDF "${response.data.filename}" uploaded successfully! Created ${response.data.chunks_created} text chunks for indexing.` 
      }]);
      
      await loadPdfs();
      
      // Auto-select the newly uploaded PDF
      setSelectedPdf(response.data.pdf_id);
      setChatMode('pdf');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error uploading PDF';
      setMessages(prev => [...prev, { role: 'error', content: errorMessage }]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    if (chatMode === 'pdf' && !selectedPdf) {
      setMessages(prev => [...prev, { role: 'error', content: 'Please select a PDF to chat with.' }]);
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let response;
      
      if (chatMode === 'pdf') {
        // RAG chat with PDF
        response = await axios.post('/api/chat-with-pdf', {
          user_message: userMessage,
          pdf_id: selectedPdf,
          api_key: apiKey,
          k: 3
        }, {
          responseType: 'text'
        });
      } else {
        // Regular chat
        response = await axios.post('/api/chat', {
          developer_message: "Respond concisely and clearly. When asked to generate stories or narratives, be imaginative and surprising, but stay logically consistent. When answering factual questions, prioritize accuracy and brevity.",
          user_message: userMessage,
          api_key: apiKey
        }, {
          responseType: 'text'
        });
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response.data }]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'An error occurred while fetching the response.';
      setMessages(prev => [...prev, { role: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePdf = async (pdfId: string) => {
    try {
      await axios.delete(`/api/pdf/${pdfId}`);
      setPdfs(prev => prev.filter(pdf => pdf.pdf_id !== pdfId));
      if (selectedPdf === pdfId) {
        setSelectedPdf('');
      }
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '🗑️ PDF deleted successfully.' 
      }]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error deleting PDF';
      setMessages(prev => [...prev, { role: 'error', content: errorMessage }]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            📚 PDF RAG Chat Assistant
          </h1>
          
          {/* API Key Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - PDF Management */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">📄 PDF Management</h2>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={!apiKey || isUploading}
                    className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-2">📤 Uploading and indexing PDF...</p>
                  )}
                </div>

                {/* PDF List */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available PDFs ({pdfs.length})
                  </label>
                  <button
                    onClick={loadPdfs}
                    className="text-sm text-blue-600 hover:text-blue-800 mb-2"
                  >
                    🔄 Refresh List
                  </button>
                  
                  {pdfs.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No PDFs uploaded yet</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {pdfs.map((pdf) => (
                        <div
                          key={pdf.pdf_id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPdf === pdf.pdf_id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPdf(pdf.pdf_id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-800 truncate">
                                {pdf.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {pdf.chunks_count} chunks
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePdf(pdf.pdf_id);
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chat Mode Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat Mode
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="regular"
                        checked={chatMode === 'regular'}
                        onChange={(e) => setChatMode(e.target.value as 'regular' | 'pdf')}
                        className="mr-2"
                      />
                      <span className="text-sm">💬 Regular Chat</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="pdf"
                        checked={chatMode === 'pdf'}
                        onChange={(e) => setChatMode(e.target.value as 'regular' | 'pdf')}
                        className="mr-2"
                      />
                      <span className="text-sm">📖 Chat with PDF</span>
                    </label>
                  </div>
                </div>

                {chatMode === 'pdf' && selectedPdf && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Selected PDF:</strong> {pdfs.find(p => p.pdf_id === selectedPdf)?.filename}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="lg:col-span-2">
              {/* Messages Display */}
              <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg border">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="text-4xl mb-4">🤖</div>
                    <p className="text-lg mb-2">Welcome to PDF RAG Chat!</p>
                    <p className="text-sm">
                      {chatMode === 'pdf' 
                        ? 'Upload a PDF and start asking questions about its content.'
                        : 'Start a conversation or upload a PDF to chat with documents.'
                      }
                    </p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto max-w-[80%]'
                        : message.role === 'error'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : message.role === 'system'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-white border border-gray-200 max-w-[80%]'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-2">
                      {message.role === 'user' ? '👤 You' : 
                       message.role === 'error' ? '❌ Error' : 
                       message.role === 'system' ? '🔧 System' : '🤖 AI Assistant'}
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="text-center text-gray-500">
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      <p>AI is thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={chatMode === 'pdf' && selectedPdf 
                    ? "Ask a question about the PDF..." 
                    : "Type your message..."
                  }
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || !apiKey}
                />
                <button
                  type="submit"
                  disabled={isLoading || !apiKey || (chatMode === 'pdf' && !selectedPdf)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {isLoading ? '⏳' : '📤'} Send
                </button>
              </form>
              
              {!apiKey && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Please enter your OpenAI API key to start chatting
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 