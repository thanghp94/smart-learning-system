import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('process-command', {
        body: { prompt }
      });
      
      setResponse(data.message);
    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xử lý yêu cầu. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Nhập yêu cầu của bạn..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button 
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim()}
        className="w-full"
      >
        <Bot className="mr-2 h-4 w-4" />
        {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
      </Button>
      {response && (
        <Card className="p-4">
          <p className="text-sm whitespace-pre-wrap">{response}</p>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
