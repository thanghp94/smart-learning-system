
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, SendHorizontal, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

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

const AICommands = () => {
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

  return (
    <div className="container py-6 space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-primary" />
            Trợ lý AI nhận lệnh
          </CardTitle>
          <CardDescription>
            Gõ lệnh bằng ngôn ngữ tự nhiên để thực hiện các tác vụ.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] p-4 overflow-y-auto flex flex-col space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                {message.role === 'assistant' && (
                  <div className="rounded-full bg-primary/10 p-2 mr-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'assistant' 
                      ? 'bg-muted text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="rounded-full bg-primary p-2 ml-2">
                    <UserCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-start justify-start">
                <div className="rounded-full bg-primary/10 p-2 mr-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t p-4 flex space-x-2">
            <Input
              placeholder="Nhập lệnh (ví dụ: thêm học sinh Nguyễn Văn A, điện thoại 0987654321)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isProcessing || !command.trim()}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ví dụ lệnh</CardTitle>
          <CardDescription>
            Bạn có thể sử dụng các lệnh dưới đây để thực hiện nhanh các tác vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer" 
                 onClick={() => setCommand('Thêm học sinh Trần Văn A, số điện thoại 0987654321')}>
              <p className="font-medium">Thêm học sinh Trần Văn A, số điện thoại 0987654321</p>
              <p className="text-sm text-muted-foreground">Thêm học sinh mới vào hệ thống</p>
            </div>
            
            <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer"
                 onClick={() => setCommand('Cập nhật học sinh Nguyễn Văn B với email mới abc@gmail.com')}>
              <p className="font-medium">Cập nhật học sinh Nguyễn Văn B với email mới abc@gmail.com</p>
              <p className="text-sm text-muted-foreground">Cập nhật thông tin học sinh</p>
            </div>
            
            <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer"
                 onClick={() => setCommand('Kiểm tra thông tin học sinh Lê Thị C')}>
              <p className="font-medium">Kiểm tra thông tin học sinh Lê Thị C</p>
              <p className="text-sm text-muted-foreground">Xem thông tin chi tiết về học sinh</p>
            </div>
            
            <div className="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer"
                 onClick={() => setCommand('Gửi email đến phụ huynh Trần Văn A thông báo về lịch học')}>
              <p className="font-medium">Gửi email đến phụ huynh Trần Văn A thông báo về lịch học</p>
              <p className="text-sm text-muted-foreground">Gửi email thông báo đến phụ huynh</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICommands;
