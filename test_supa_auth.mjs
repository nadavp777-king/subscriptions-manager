import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';
  
  console.log("Signing up...");
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authError) {
    console.error("Auth error:", authError);
    return;
  }
  
  const user = authData.user;
  console.log("Logged in as:", user.id);
  
  console.log("Attempting insert...");
  const { data, error } = await supabase.from('subscriptions').insert([
    {
      user_id: user.id,
      name: 'Netflix',
      price: 15.99,
      billingCycle: 'Monthly',
      category: 'Entertainment',
      nextBillingDate: new Date().toISOString()
    }
  ]).select();
  
  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Insert success:", data);
  }
}

test();
