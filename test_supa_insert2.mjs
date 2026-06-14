import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('get_schema');
  // Wait, I don't have rpc for this. Let's just try to insert with billing_cycle.
  const { data: d2, error: e2 } = await supabase.from('subscriptions').insert([
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      name: 'test',
      price: 10,
      billing_cycle: 'Monthly',
      category: 'Entertainment'
    }
  ]).select();
  
  if (e2) console.error("Error with billing_cycle:", e2);
  else console.log("Success with billing_cycle!");
  
  const { data: d3, error: e3 } = await supabase.from('subscriptions').insert([
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      name: 'test',
      price: 10,
      billingcycle: 'Monthly',
      category: 'Entertainment'
    }
  ]).select();
  
  if (e3) console.error("Error with billingcycle:", e3);
  else console.log("Success with billingcycle!");

}

test();
