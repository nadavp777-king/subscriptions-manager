/**
 * Utility function to call the Grok (xAI) API.
 * 
 * NOTE: Calling the API directly from the frontend exposes your API key. 
 * For a production app, you should route this request through a backend server.
 * 
 * To use this, add your API key to .env.local:
 * VITE_GROK_API_KEY=your_api_key_here
 */

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

export async function fetchGrokChatCompletion(messages, model = 'grok-beta') {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GROK_API_KEY is missing from environment variables.');
  }

  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages,
        model,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Grok API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Grok API:', error);
    throw error;
  }
}
