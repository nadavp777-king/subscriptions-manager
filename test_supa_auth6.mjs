import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error } = await supabase.from('subscriptions').insert([
    { user_id: '00000000-0000-0000-0000-000000000000', name: 'test', amount: 10, next_billing_date: new Date().toISOString(), category: 'test', billing_cycle: 'Monthly' }
  ]).select();
  
  console.error("Insert error:", error);
}

test();
