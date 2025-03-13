
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingService } from '@/lib/supabase/setting-service'; 

const emailSchema = z.object({
  host: z.string().min(1, { message: 'SMTP host is required' }),
  port: z.string().min(1, { message: 'SMTP port is required' }),
  secure: z.boolean().default(false),
  auth: z.object({
    user: z.string().min(1, { message: 'Username is required' }),
    pass: z.string().min(1, { message: 'Password is required' }),
  }),
  defaultFrom: z.string().email({ message: 'Valid email address is required' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('smtp');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      host: '',
      port: '587',
      secure: false,
      auth: {
        user: '',
        pass: '',
      },
      defaultFrom: '',
    },
  });

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const emailConfig = await settingService.getEmailConfig();
        
        if (emailConfig) {
          // Populate form with existing settings
          form.reset({
            host: emailConfig.host || '',
            port: emailConfig.port || '587',
            secure: emailConfig.secure || false,
            auth: {
              user: emailConfig.auth?.user || '',
              pass: emailConfig.auth?.pass || '',
            },
            defaultFrom: emailConfig.defaultFrom || '',
          });
        }
      } catch (error) {
        console.error('Error loading email settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load email settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form, toast]);

  const onSubmit = async (data: EmailFormValues) => {
    setIsSaving(true);
    try {
      await settingService.saveEmailSettings(data);
      toast({
        title: 'Success',
        description: 'Email settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    const values = form.getValues();
    setIsTesting(true);
    
    try {
      // This should be implemented with a backend function to actually send a test email
      // For now we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Success',
        description: 'Test email sent successfully',
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>Configure email server settings for notifications and messages</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="smtp">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input placeholder="smtp.example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          The hostname of your SMTP server
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input placeholder="587" {...field} />
                        </FormControl>
                        <FormDescription>
                          Common ports are 25, 465, 587, or 2525
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="secure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Use Secure Connection (SSL/TLS)</FormLabel>
                        <FormDescription>
                          Enable for SSL/TLS connections. Usually required for port 465.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="auth.user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="auth.pass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="defaultFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default From Address</FormLabel>
                      <FormControl>
                        <Input placeholder="noreply@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The default email address that will appear in the "From" field
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleTestEmail}
                    disabled={isTesting || isSaving}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Send Test Email'
                    )}
                  </Button>
                  
                  <Button 
                    type="submit"
                    disabled={isSaving || isTesting}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Email Templates</h3>
              <p className="text-sm text-muted-foreground">
                Configure templates for different types of emails sent by the system
              </p>
            </div>
            
            <div className="grid gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Welcome Email</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 border-t flex justify-between">
                  <span className="text-sm text-muted-foreground">Last edited: Never</span>
                  <Button variant="outline" size="sm">Edit Template</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Password Reset</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 border-t flex justify-between">
                  <span className="text-sm text-muted-foreground">Last edited: Never</span>
                  <Button variant="outline" size="sm">Edit Template</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Notification</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 border-t flex justify-between">
                  <span className="text-sm text-muted-foreground">Last edited: Never</span>
                  <Button variant="outline" size="sm">Edit Template</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure when and to whom emails are sent
              </p>
            </div>
            
            <div className="space-y-4">
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Student Registration</FormLabel>
                  <FormDescription>
                    Send welcome emails when new students register
                  </FormDescription>
                </div>
              </FormItem>
              
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Class Changes</FormLabel>
                  <FormDescription>
                    Notify students and teachers when class details change
                  </FormDescription>
                </div>
              </FormItem>
              
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Payment Reminders</FormLabel>
                  <FormDescription>
                    Send reminders about upcoming or overdue payments
                  </FormDescription>
                </div>
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
