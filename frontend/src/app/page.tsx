'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        developer_message: "You are a helpful AI assistant.",
        user_message: userMessage,
        api_key: apiKey
      }, {
        responseType: 'text'
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'error', content: 'An error occurred while fetching the response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">AI Chat Interface</h1>
          
          {/* API Key Input */}
          <div className="mb-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Messages Display */}
          <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-auto'
                    : message.role === 'error'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                } max-w-[80%]`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.role === 'user' ? 'You' : message.role === 'error' ? 'Error' : 'AI Assistant'}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500">
                <p>AI is thinking...</p>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !apiKey}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 