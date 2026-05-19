import http from 'http';
import https from 'https';

const PORT = 8090;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    const path = req.url.replace('/hs', '') || '/';
    const url = `https://api.hubapi.com${path}`;

    const auth = req.headers.authorization || '';
    const options = {
      method: req.method,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      }
    };

    const proxyReq = https.request(url, options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    if (req.method === 'POST' || req.method === 'PUT') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }

    proxyReq.on('error', (err) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });
  } catch (err) {
    res.writeHead(502);
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Proxy local rodando em http://localhost:${PORT}`);
});
