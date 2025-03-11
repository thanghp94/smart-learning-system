
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface AIAssistantProps {}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?',
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Process the command with our Supabase function
      const { data, error } = await supabase.rpc('process_ai_command', {
        command_text: input,
        context: { messages: messages.map(m => ({ content: m.content, role: m.isUser ? 'user' : 'assistant' })) }
      });

      if (error) {
        console.error('Error processing AI command:', error);
        toast({
          title: 'Lỗi xử lý',
          description: 'Không thể xử lý lệnh AI',
          variant: 'destructive',
        });
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
            isUser: false,
          },
        ]);
      } else {
        // Add AI response
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: data.result || 'Đã xử lý lệnh thành công',
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast({
        title: 'Lỗi kết nối',
        description: 'Không thể kết nối đến dịch vụ AI',
        variant: 'destructive',
      });
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: 'Xin lỗi, tôi không thể kết nối đến dịch vụ AI. Vui lòng kiểm tra kết nối mạng và thử lại.',
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Bot className="mr-2 h-5 w-5" />
          Trợ lý AI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pt-0 pb-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                <p className="text-sm">Đang xử lý...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Nhập câu hỏi hoặc yêu cầu..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
