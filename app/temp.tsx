"use client";

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export default function OpenRouterTest() {
  const [selectedModel, setSelectedModel] = useState('openrouter/anthropic/claude-3-haiku');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/search',
    body: {
      model: selectedModel,
      group: 'web',
      user_id: 'test-user',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4 text-center">اختبار OpenRouter</h1>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <Button 
          variant={selectedModel === 'openrouter/anthropic/claude-3-haiku' ? 'default' : 'outline'}
          onClick={() => setSelectedModel('openrouter/anthropic/claude-3-haiku')}
        >
          Claude Haiku
        </Button>
        <Button 
          variant={selectedModel === 'openrouter/mistralai/mixtral-8x7b-instruct' ? 'default' : 'outline'}
          onClick={() => setSelectedModel('openrouter/mistralai/mixtral-8x7b-instruct')}
        >
          Mixtral 8x7b
        </Button>
        <Button 
          variant={selectedModel === 'openrouter/meta-llama/llama-3-8b-instruct' ? 'default' : 'outline'}
          onClick={() => setSelectedModel('openrouter/meta-llama/llama-3-8b-instruct')}
        >
          Llama 3 8B
        </Button>
        <Button 
          variant={selectedModel === 'mistralai/mistral-7b-instruct:free' ? 'default' : 'outline'}
          onClick={() => setSelectedModel('mistralai/mistral-7b-instruct:free')}
        >
          Mistral 7B (مجاني)
        </Button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2 text-center">النموذج المحدد: <span className="font-semibold">{selectedModel}</span></p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="اكتب رسالتك هنا..."
          className="w-full min-h-[100px] p-4"
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال'}
        </Button>
      </form>
      
      <div className="mt-8 space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="font-semibold mb-2">
              {message.role === 'user' ? 'أنت' : 'AI'}:
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
