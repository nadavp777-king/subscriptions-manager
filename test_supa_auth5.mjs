import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';
  
  const { data: authData } = await supabase.auth.signUp({ email, password });
  const user = authData.user;
  
  const { error } = await supabase.from('subscriptions').insert([
    { user_id: user.id, name: 'test', amount: 10, next_billing_date: new Date().toISOString() }
  ]).select();
  
  console.error("Insert error:", error);
}

test();
