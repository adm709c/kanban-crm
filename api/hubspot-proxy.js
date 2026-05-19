export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Test endpoint
  if (req.url === '/api/hubspot-proxy/test') {
    const auth = req.headers.authorization || '';
    return res.json({
      test: 'ok',
      authHeaderLength: auth.length,
      authToken: auth.slice(0, 20) + '...',
      timestamp: new Date().toISOString()
    });
  }

  try {
    console.log('[HubSpot Proxy] req.url:', req.url);
    console.log('[HubSpot Proxy] req.method:', req.method);
    const auth = req.headers.authorization || '';
    console.log('[HubSpot Proxy] Authorization header:', auth.slice(0, 30) + (auth.length > 30 ? '...' : ''));
    console.log('[HubSpot Proxy] req.body type:', typeof req.body, Buffer.isBuffer(req.body) ? 'Buffer' : '');

    // Remove query string from path
    const pathWithQuery = req.url.replace(/^\/api\/hubspot-proxy/, '') || '';
    const path = pathWithQuery.split('?')[0];
    const target = `https://api.hubapi.com${path}`;

    console.log('[HubSpot Proxy] target:', target);

    const auth = req.headers.authorization || '';
    const method = req.method;

    let body = null;
    if (method === 'POST' || method === 'PUT') {
      // Handle body - could be string, buffer, or object
      if (typeof req.body === 'string') {
        body = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        body = req.body.toString('utf-8');
      } else if (req.body && typeof req.body === 'object') {
        body = JSON.stringify(req.body);
      }
    }

    console.log('[HubSpot Proxy] body length:', body ? body.length : 0);

    const fetchOptions = {
      method,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'User-Agent': 'MarketingOps/1.0'
      }
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(target, fetchOptions);
    const responseText = await response.text();

    console.log('[HubSpot Proxy] HubSpot response status:', response.status);
    console.log('[HubSpot Proxy] HubSpot response:', responseText.slice(0, 300));

    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');

    try {
      res.json(JSON.parse(responseText));
    } catch {
      res.send(responseText);
    }
  } catch (err) {
    console.error('[HubSpot Proxy] Error:', err.message);
    res.status(502).json({ error: err.message });
  }
}
