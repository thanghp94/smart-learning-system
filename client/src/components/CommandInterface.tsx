
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { databaseService } from "@/lib/database";

const CommandInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lastCommand, setLastCommand] = useState('');
  const { toast } = useToast();

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
      const response = await databaseService.functions.invoke('generate-with-openai', {
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
    <Card className="overflow-hidden h-full">
      <CardContent className="flex flex-col space-y-4 p-3">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Nhập lệnh AI..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
            className="text-sm"
          />
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={loading}
            size="sm"
            className="whitespace-nowrap"
          >
            {loading ? 'Đang xử lý...' : 'Thực hiện'}
          </Button>
        </div>

        {lastCommand && (
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-1">
              <Badge variant="secondary" className="text-xs">Lệnh gần nhất:</Badge>
              <span className="text-xs text-gray-500">{lastCommand}</span>
            </div>
            {result && (
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">Kết quả:</Badge>
                <div className="prose prose-xs max-w-none text-xs border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
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
          <div className="space-y-1">
            <Badge variant="default" className="text-xs">Lịch sử lệnh:</Badge>
            <ScrollArea className="h-24 rounded-md border p-2">
              <div className="flex flex-col space-y-1">
                {commandHistory.slice().reverse().map((command, index) => (
                  <div key={index} className="text-xs text-gray-500">
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
