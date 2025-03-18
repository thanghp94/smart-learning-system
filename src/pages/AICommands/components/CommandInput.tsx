
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface CommandInputProps {
  command: string;
  setCommand: (command: string) => void;
  isProcessing: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CommandInput: React.FC<CommandInputProps> = ({
  command,
  setCommand,
  isProcessing,
  handleSubmit,
}) => {
  return (
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
  );
};

export default CommandInput;
