export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const path = req.url.replace(/^\/api\/hubspot-proxy/, '');
    const target = `https://api.hubapi.com${path}`;

    const auth = req.headers.authorization || '';
    const method = req.method;

    let body = null;
    if (method === 'POST' || method === 'PUT') {
      if (typeof req.body === 'string') {
        body = req.body;
      } else if (req.body) {
        body = JSON.stringify(req.body);
      }
    }

    const fetchOptions = {
      method,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'User-Agent': 'MarketingOps/1.0'
      }
    };

    if (body) fetchOptions.body = body;

    const response = await fetch(target, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
