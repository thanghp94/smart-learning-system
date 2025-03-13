
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Send } from 'lucide-react';
import { settingService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';

const emailSettingsSchema = z.object({
  smtp_host: z.string().min(1, { message: 'SMTP host is required' }),
  smtp_port: z.string().min(1, { message: 'SMTP port is required' }),
  smtp_user: z.string().min(1, { message: 'SMTP username is required' }),
  smtp_pass: z.string().min(1, { message: 'SMTP password is required' }),
  smtp_from_email: z.string().email({ message: 'Must be a valid email' }),
  smtp_from_name: z.string().min(1, { message: 'From name is required' }),
});

const testEmailSchema = z.object({
  to_email: z.string().email({ message: 'Must be a valid email' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  body: z.string().min(1, { message: 'Email body is required' }),
});

type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;
type TestEmailFormValues = z.infer<typeof testEmailSchema>;

const EmailSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const { toast } = useToast();

  const settingsForm = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtp_host: '',
      smtp_port: '',
      smtp_user: '',
      smtp_pass: '',
      smtp_from_email: '',
      smtp_from_name: '',
    },
  });

  const testEmailForm = useForm<TestEmailFormValues>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      to_email: '',
      subject: 'Test Email from System',
      body: 'This is a test email from your application.',
    },
  });

  useEffect(() => {
    const loadEmailSettings = async () => {
      try {
        // Load settings from the database
        const settings = await settingService.getByCategory('email');
        
        if (settings && settings.length > 0) {
          const emailSettings = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
          }, {});
          
          settingsForm.reset({
            smtp_host: emailSettings.smtp_host || '',
            smtp_port: emailSettings.smtp_port || '',
            smtp_user: emailSettings.smtp_user || '',
            smtp_pass: emailSettings.smtp_pass || '',
            smtp_from_email: emailSettings.smtp_from_email || '',
            smtp_from_name: emailSettings.smtp_from_name || '',
          });
        }
      } catch (error) {
        console.error('Error loading email settings:', error);
        toast({
          title: 'Error',
          description: 'Could not load email settings',
          variant: 'destructive',
        });
      }
    };

    loadEmailSettings();
  }, [toast, settingsForm]);

  const onSaveSettings = async (data: EmailSettingsFormValues) => {
    setIsSaving(true);
    try {
      // Save each setting individually
      const settings = Object.entries(data).map(([key, value]) => ({
        key,
        value,
        category: 'email',
      }));
      
      for (const setting of settings) {
        await settingService.upsertSetting(setting.key, setting.value, setting.category);
      }
      
      toast({
        title: 'Success',
        description: 'Email settings have been saved',
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Error',
        description: 'Could not save email settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSendTestEmail = async (data: TestEmailFormValues) => {
    setIsSendingTest(true);
    try {
      // Get the current email settings
      const settings = await settingService.getByCategory('email');
      const emailSettings = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      
      // Here you would normally call an API endpoint to send the test email
      // For now, we'll just show a success toast
      console.log('Sending test email with settings:', emailSettings);
      console.log('Test email data:', data);
      
      toast({
        title: 'Success',
        description: 'Test email has been sent',
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: 'Could not send test email',
        variant: 'destructive',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground">Configure SMTP settings for sending emails</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="settings">SMTP Settings</TabsTrigger>
          <TabsTrigger value="test">Test Email</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Set up your SMTP server for sending emails from the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(onSaveSettings)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={settingsForm.control}
                      name="smtp_host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={settingsForm.control}
                      name="smtp_port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input placeholder="587" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={settingsForm.control}
                      name="smtp_user"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={settingsForm.control}
                      name="smtp_pass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={settingsForm.control}
                      name="smtp_from_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input placeholder="no-reply@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={settingsForm.control}
                      name="smtp_from_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Email</CardTitle>
              <CardDescription>
                Test your email configuration by sending a test email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...testEmailForm}>
                <form onSubmit={testEmailForm.handleSubmit(onSendTestEmail)} className="space-y-4">
                  <FormField
                    control={testEmailForm.control}
                    name="to_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Email</FormLabel>
                        <FormControl>
                          <Input placeholder="test@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter an email address to receive the test email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testEmailForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testEmailForm.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Body</FormLabel>
                        <FormControl>
                          <Textarea rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSendingTest}>
                    {isSendingTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage email templates used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-medium">Welcome Email</Label>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sent to new users when they sign up for an account
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-medium">Password Reset</Label>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sent when a user requests a password reset
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-medium">Invoice</Label>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sent to customers when an invoice is generated
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Add New Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettings;
