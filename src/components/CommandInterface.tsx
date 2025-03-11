
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Mic, MicOff } from "lucide-react";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CommandInterface: React.FC = () => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<{
    text: string;
    success?: boolean;
    data?: any;
  } | null>(null);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const processCommand = async () => {
    if (!command.trim()) {
      toast({
        title: "Lệnh trống",
        description: "Vui lòng nhập lệnh để xử lý",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-command', {
        body: { command: command }
      });

      if (error) {
        throw new Error(`Lỗi khi xử lý lệnh: ${error.message}`);
      }

      setResponse({
        text: data.responseText || 'Đã xử lý lệnh thành công.',
        success: data.result?.success,
        data: data.result?.data
      });

      // Nếu thành công, xóa lệnh để người dùng có thể nhập lệnh mới
      if (data.result?.success) {
        setCommand('');
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xử lý lệnh. Vui lòng thử lại.",
        variant: "destructive",
      });
      setResponse({
        text: 'Đã xảy ra lỗi khi xử lý lệnh của bạn. Vui lòng thử lại hoặc liên hệ với quản trị viên.',
        success: false
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1] || '';
          
          setIsProcessing(true);
          try {
            // Gọi edge function để chuyển đổi âm thanh thành văn bản
            const { data, error } = await supabase.functions.invoke('generate-with-openai', {
              body: { 
                prompt: base64Audio, 
                type: 'text',
                model: 'whisper-1'
              }
            });
            
            if (error) throw new Error(error.message);
            
            if (data && data.generatedText) {
              setCommand(data.generatedText);
            } else {
              toast({
                title: "Không nhận dạng được",
                description: "Không thể chuyển đổi âm thanh thành văn bản. Vui lòng thử lại.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
            toast({
              title: "Lỗi",
              description: "Không thể chuyển đổi âm thanh thành văn bản. Vui lòng thử lại.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        };
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Đang ghi âm...",
        description: "Hãy nói lệnh của bạn và nhấn dừng khi hoàn thành.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Lỗi",
        description: "Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập và thử lại.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Dừng tất cả các track trong stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Đã dừng ghi âm",
        description: "Đang xử lý âm thanh của bạn...",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processCommand();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Trợ lý AI</CardTitle>
          <CardDescription>
            Nhập lệnh bằng ngôn ngữ tự nhiên hoặc sử dụng giọng nói để thực hiện các tác vụ trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Textarea
              placeholder="Nhập lệnh (ví dụ: Thêm học sinh Nguyễn Văn A, điện thoại 0912345678 mẹ Nguyễn Thị B)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-none"
            />
          </div>

          {response && (
            <Card className={`border-l-4 ${response.success ? 'border-l-green-500' : 'border-l-amber-500'}`}>
              <CardContent className="pt-4">
                <div className="whitespace-pre-line">{response.text}</div>
                
                {response.data && (
                  <div className="mt-4 bg-slate-100 p-3 rounded text-sm">
                    <div className="font-semibold mb-1">Chi tiết dữ liệu:</div>
                    <pre className="overflow-auto max-h-[200px]">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          <Button 
            onClick={processCommand} 
            disabled={isProcessing || !command.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Thực hiện
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommandInterface;
