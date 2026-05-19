#!/usr/bin/env python3
"""Proxy local para HubSpot API — resolve CORS."""
import http.server, urllib.request, urllib.parse, sys

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        path = self.path
        if not path.startswith('/hs/'):
            self.send_response(404); self.end_headers(); return
        target = 'https://api.hubapi.com/' + path[4:]
        auth   = self.headers.get('Authorization', '')
        length = int(self.headers.get('Content-Length', 0))
        body   = self.rfile.read(length) if length else b''
        req = urllib.request.Request(target, data=body, headers={
            'Authorization': auth,
            'Content-Type': 'application/json',
            'User-Agent': 'MarketingOps/1.0'
        }, method='POST')
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(data)
        except urllib.error.HTTPError as e:
            body2 = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(body2)
        except Exception as e:
            self.send_response(502)
            self._cors()
            self.end_headers()
            self.wfile.write(str(e).encode())

    def do_GET(self):
        path = self.path  # e.g. /hs/crm/v3/objects/deals?...
        if not path.startswith('/hs/'):
            self.send_response(404); self.end_headers(); return
        target = 'https://api.hubapi.com/' + path[4:]
        auth   = self.headers.get('Authorization', '')
        req = urllib.request.Request(target, headers={'Authorization': auth, 'User-Agent': 'MarketingOps/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(data)
        except urllib.error.HTTPError as e:
            body = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_response(502)
            self._cors()
            self.end_headers()
            self.wfile.write(str(e).encode())

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

    def log_message(self, fmt, *args):
        pass  # silencia logs

if __name__ == '__main__':
    port = 8090
    server = http.server.HTTPServer(('localhost', port), ProxyHandler)
    print(f'  Proxy HubSpot rodando em http://localhost:{port}')
    server.serve_forever()
