import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"

const CommandInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lastCommand, setLastCommand] = useState('');
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Load command history from local storage on component mount
    const storedHistory = localStorage.getItem('commandHistory');
    if (storedHistory) {
      setCommandHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    // Save command history to local storage whenever it changes
    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
  }, [commandHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Giảm kích thước AI bằng cách sử dụng mô hình nhỏ hơn và tối ưu hóa prompt
  const processCommand = async (input: string) => {
    if (!input.trim()) return;
    
    setLoading(true);
    setLastCommand(input);
    
    try {
      const response = await supabase.functions.invoke('generate-with-openai', {
        body: { 
          prompt: input,
          model: 'gpt-4o-mini' // Sử dụng mô hình nhỏ hơn
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to process command');
      }
      
      setResult(response.data?.generatedText || 'Không có kết quả');
      setCommandHistory([...commandHistory, input]);
    } catch (error) {
      console.error('Error processing command:', error);
      setResult('Có lỗi xảy ra khi xử lý lệnh. Vui lòng thử lại sau.');
      toast({
        title: 'Lỗi',
        description: 'Không thể xử lý lệnh. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await processCommand(input);
      setInput('');
    }
  };

  const handleSubmit = async () => {
    await processCommand(input);
    setInput('');
  };

  return (
    <Card>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Nhập lệnh AI..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Thực hiện'}
          </Button>
        </div>

        {lastCommand && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Lệnh gần nhất:</Badge>
              <span className="text-sm text-gray-500">{lastCommand}</span>
            </div>
            {result && (
              <div className="space-y-2">
                <Badge variant="outline">Kết quả:</Badge>
                <div className="prose prose-sm max-w-none">
                  {result.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {commandHistory.length > 0 && (
          <div className="space-y-2">
            <Badge variant="default">Lịch sử lệnh:</Badge>
            <ScrollArea className="h-40 rounded-md border p-2">
              <div className="flex flex-col space-y-1">
                {commandHistory.slice().reverse().map((command, index) => (
                  <div key={index} className="text-sm text-gray-500">
                    {command}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommandInterface;
