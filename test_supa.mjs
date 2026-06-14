import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching subscriptions...");
  const { data, error } = await supabase.from('subscriptions').select('*').limit(1);
  if (error) {
    console.error("Error fetching:", error);
  } else {
    console.log("Fetch success:", data);
  }
}

test();
