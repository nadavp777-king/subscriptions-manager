import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { corsHeaders } from '../_shared/cors.ts'

const basePrices = {
  'netflix': 15.49,
  'spotify': 10.99,
  'apple music': 10.99,
  'youtube premium': 13.99,
  'disney+': 13.99,
  'hulu': 7.99,
  'amazon prime': 14.99,
  'playstation plus': 9.99,
  'xbox game pass': 10.99,
  'chatgpt plus': 20.00
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Create a dynamic market fluctuation between -0.50 and +0.50
    // This replaces the old Bitcoin dependency to be purely internal
    const fluctuation = (Math.random() - 0.50);

    const updates = [];

    for (const [service, basePrice] of Object.entries(basePrices)) {
      let livePrice = basePrice + fluctuation;
      livePrice = Math.round(livePrice * 2) / 2 - 0.01; // Round to .49 or .99
      if (livePrice < 1) livePrice = 1.99; // Floor

      updates.push(
        supabaseClient
          .from('market_prices')
          .update({ standard_price: livePrice })
          .eq('service_name', service)
      );
    }

    await Promise.all(updates);

    return new Response(JSON.stringify({ success: true, message: "Market prices synchronized." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
