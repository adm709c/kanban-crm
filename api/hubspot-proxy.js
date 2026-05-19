export default async function handler(req, res) {
  // Ativa CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extrai path: /api/hubspot-proxy/crm/v3/objects/deals → /crm/v3/objects/deals
    const path = req.url.replace(/^\/api\/hubspot-proxy/, '');
    const target = `https://api.hubapi.com${path}`;

    const auth = req.headers.authorization || '';
    const method = req.method;
    const body = method === 'POST' || method === 'PUT' ? JSON.stringify(req.body) : null;

    const headers = {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'User-Agent': 'MarketingOps/1.0'
    };

    const fetchOptions = {
      method,
      headers,
      ...(body && { body })
    };

    const response = await fetch(target, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
