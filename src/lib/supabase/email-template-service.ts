
import { supabase } from './client';

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
  type: 'student' | 'employee' | 'candidate';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const emailTemplateService = {
  async getAll(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }

    return data || [];
  },

  async getByType(type: 'student' | 'employee' | 'candidate'): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${type} email templates:`, error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      throw error;
    }

    return data;
  },

  async create(template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      console.error('Error creating email template:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email template:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  },
};
