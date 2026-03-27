import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  thinking?: string;
  analysis?: string;
  steps?: { title: string; desc: string }[];
  code?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatStep {
  title: string;
  desc: string;
}

class ChatService {
  async saveMessage(
    projectId: string,
    role: 'user' | 'assistant',
    content: string,
    options?: {
      model?: string;
      thinking?: string;
      analysis?: string;
      steps?: ChatStep[];
      code?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          project_id: projectId,
          role,
          content,
          model: options?.model,
          thinking: options?.thinking,
          analysis: options?.analysis,
          steps: options?.steps ? JSON.stringify(options.steps) : [],
          code: options?.code,
          metadata: options?.metadata || {},
        })
        .select()
        .single();

      if (error) {
        console.error('[ChatService] Error saving message:', error);
        return null;
      }

      return data as ChatMessage;
    } catch (err) {
      console.error('[ChatService] Exception saving message:', err);
      return null;
    }
  }

  async getMessages(projectId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[ChatService] Error fetching messages:', error);
        return [];
      }

      return (data || []).map(msg => ({
        ...msg,
        steps: typeof msg.steps === 'string' ? JSON.parse(msg.steps) : msg.steps,
      })) as ChatMessage[];
    } catch (err) {
      console.error('[ChatService] Exception fetching messages:', err);
      return [];
    }
  }

  async deleteMessages(projectId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('project_id', projectId);

      if (error) {
        console.error('[ChatService] Error deleting messages:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[ChatService] Exception deleting messages:', err);
      return false;
    }
  }

  async updateMessage(
    messageId: string,
    updates: Partial<ChatMessage>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update(updates)
        .eq('id', messageId);

      if (error) {
        console.error('[ChatService] Error updating message:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[ChatService] Exception updating message:', err);
      return false;
    }
  }
}

export const chatService = new ChatService();
