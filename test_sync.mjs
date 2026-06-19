import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testSyncMarket() {
  console.log("🚀 Testing AI Pricing Oracle (sync-market)...");
  console.log("Calling Supabase Edge Function which will query Grok AI...");
  
  const startTime = Date.now();
  const { data, error } = await supabase.functions.invoke('sync-market');
  const endTime = Date.now();

  if (error) {
    console.error("❌ Error Status:", error.context?.status);
    if (error.context) {
      console.error("Error Body:", await error.context.text());
    }
  } else {
    console.log(`✅ Success! Response received in ${(endTime - startTime) / 1000} seconds.`);
    console.log("📦 Data returned from Grok and saved to DB:");
    console.log(JSON.stringify(data, null, 2));
  }
}

testSyncMarket();
