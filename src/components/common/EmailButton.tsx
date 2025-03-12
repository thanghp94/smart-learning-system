
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import EmailDialog from './EmailDialog';

interface EmailButtonProps extends ButtonProps {
  recipientEmail: string;
  recipientName: string;
  recipientType: 'student' | 'employee' | 'candidate';
  icon?: boolean;
  label?: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({
  recipientEmail,
  recipientName,
  recipientType,
  icon = true,
  label = 'Email',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!recipientEmail) {
    return null;
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        {...props}
      >
        {icon && <Mail className="h-4 w-4 mr-1" />}
        {label}
      </Button>

      <EmailDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        recipientEmail={recipientEmail}
        recipientName={recipientName}
        recipientType={recipientType}
      />
    </>
  );
};

export default EmailButton;
