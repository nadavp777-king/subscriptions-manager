import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Inserting subscription...");
  const { data, error } = await supabase.from('subscriptions').insert([
    {
      user_id: '00000000-0000-0000-0000-000000000000', // invalid uuid but let's see if it errors on uuid or RLS
      name: 'test',
      price: 10,
      billingCycle: 'Monthly',
      category: 'Entertainment'
    }
  ]).select();
  
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Insert success:", data);
  }
}

test();
