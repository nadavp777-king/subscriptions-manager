import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fybjxyyllwjeiceyjnsb.supabase.co';
const supabaseKey = 'sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: d, error: e } = await supabase.from('subscriptions').insert([
    {
      name: 'test'
    }
  ]).select();
  
  if (e) console.error("Error:", e);
  else console.log("Success:", d);
}

test();
