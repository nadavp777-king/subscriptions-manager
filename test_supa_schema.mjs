const url = 'https://fybjxyyllwjeiceyjnsb.supabase.co/rest/v1/?apikey=sb_publishable_EVKZt9ieeOb0GAf9PvVQcA_UzVj6ift';

async function fetchSchema() {
  const res = await fetch(url, {
    method: 'GET'
  });
  const data = await res.json();
  if (data.definitions && data.definitions.subscriptions) {
    console.log(Object.keys(data.definitions.subscriptions.properties));
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

fetchSchema();
