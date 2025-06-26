
import React from 'react';
import { MessageSquare, UserCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessagesListProps {
  messages: Message[];
  isProcessing: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, isProcessing }) => {
  return (
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
  );
};

export default MessagesList;
