
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import CommandInput from './CommandInput';
import MessagesList from './MessagesList';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CommandCardProps {
  messages: Message[];
  isProcessing: boolean;
  command: string;
  setCommand: (command: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CommandCard: React.FC<CommandCardProps> = ({
  messages,
  isProcessing,
  command,
  setCommand,
  handleSubmit,
}) => {
  return (
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
        <MessagesList messages={messages} isProcessing={isProcessing} />
        <CommandInput 
          command={command} 
          setCommand={setCommand} 
          isProcessing={isProcessing} 
          handleSubmit={handleSubmit} 
        />
      </CardContent>
    </Card>
  );
};

export default CommandCard;
