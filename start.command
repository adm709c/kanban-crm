#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  Iniciando Marketing Ops..."
python3 proxy.py &
PROXY_PID=$!
sleep 0.5
open "http://localhost:8089"
python3 -m http.server 8089
kill $PROXY_PID 2>/dev/null
