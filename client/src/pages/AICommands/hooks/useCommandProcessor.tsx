
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CommandResponse {
  parsedCommand: {
    intent: string;
    confidence: number;
    entities: Record<string, string>;
  };
  result: {
    success: boolean;
    message: string;
    data?: any;
  };
  responseText: string;
}

export const useCommandProcessor = () => {
  const [command, setCommand] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI. Bạn có thể ra lệnh để tôi thực hiện các tác vụ như thêm học sinh, kiểm tra thông tin, gửi email, v.v.',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: command,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-command', {
        body: { command: command.trim() }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const response = data as CommandResponse;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.result.success) {
        toast({
          title: 'Thành công',
          description: response.result.message,
        });
      } else {
        toast({
          title: 'Không thể thực hiện lệnh',
          description: response.result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra khi thực hiện lệnh của bạn. Vui lòng thử lại sau.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Lỗi',
        description: 'Không thể kết nối với máy chủ. Vui lòng thử lại sau.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setCommand('');
    }
  };

  return {
    command,
    setCommand,
    messages,
    isProcessing,
    handleSubmit
  };
};
