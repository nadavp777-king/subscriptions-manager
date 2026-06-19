import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const grokApiKey = Deno.env.get('GROK_API_KEY');
    if (!grokApiKey) throw new Error('GROK_API_KEY is missing in Supabase secrets');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Call Grok AI as a financial oracle to fetch real-world prices
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grokApiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a financial data API. Provide the current standard US monthly subscription prices for the requested services. Reply ONLY with a valid JSON object where keys are the exact lowercase service names requested and values are the floating-point prices. No markdown formatting, no backticks, just raw JSON data."
          },
          {
            role: "user",
            content: "Provide prices for: netflix, spotify, apple music, youtube premium, disney+, hulu, amazon prime, playstation plus, xbox game pass, chatgpt plus."
          }
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0.1
      }),
    });

    if (!grokResponse.ok) {
      throw new Error(`Grok API returned ${grokResponse.status}`);
    }

    const data = await grokResponse.json();
    let messageContent = data.choices[0].message.content.trim();
    
    // Safety parsing in case Grok wraps JSON in markdown blocks
    if (messageContent.startsWith('```')) {
      messageContent = messageContent.replace(/^```(json)?\n/, '').replace(/\n```$/, '');
    }

    const livePrices = JSON.parse(messageContent);
    const updates = [];

    // Loop through the AI's response and update the database
    for (const [service, price] of Object.entries(livePrices)) {
      if (typeof price === 'number') {
        updates.push(
          supabaseClient
            .from('market_prices')
            .update({ standard_price: price })
            .eq('service_name', service)
        );
      }
    }

    await Promise.all(updates);

    return new Response(JSON.stringify({ success: true, ai_prices: livePrices }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
