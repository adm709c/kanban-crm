export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const path = req.query.path || '/';
    const target = `https://api.hubapi.com${path}`;
    const auth = req.headers.authorization || '';
    const method = req.method;

    let body = null;
    if (method === 'POST' || method === 'PUT') {
      body = JSON.stringify(req.body);
    }

    const response = await fetch(target, {
      method,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
