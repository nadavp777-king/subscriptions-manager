import { supabase } from './supabase';

/**
 * Utility function to call the Grok (xAI) API securely via Supabase Edge Functions.
 */

export async function fetchGrokChatCompletion(messages, model = 'grok-beta') {
  try {
    const { data, error } = await supabase.functions.invoke('grok-chat', {
      body: { messages, model },
    });

    if (error) {
      throw new Error(`Edge Function Error: ${error.message}`);
    }
    
    if (data && data.error) {
      throw new Error(`Grok API Error: ${data.error}`);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Grok Edge Function:', error);
    throw error;
  }
}
