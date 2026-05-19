# HubSpot Setup - Quando tiver novo token

## 1. Gerar novo token HubSpot
- Acesse: https://app.hubspot.com
- Menu: Configurações → Integrations → Private Apps
- Crie uma nova app ou copie o token de uma existente
- Formato esperado: `pat-na1-XXXX...`

## 2. Reabilitar botão de Sincronização
Quando tiver o token, edite `index.html` linha ~1336:
```html
<!-- Remove o 'disabled' e a mensagem de manutenção -->
<button class="roas-sync-btn" id="roas-sync-btn" onclick="syncHubSpot()">⟳ Sincronizar</button>
```

## 3. Testar no localhost
- Cole o token no campo "Token HubSpot" na aba Painel de Mídia
- Clique em "Sincronizar"
- Monitore o console (F12) para erros

## 4. Deploy no Vercel
```bash
git add -A
git commit -m "Reabilitar sincronização HubSpot com novo token"
git push
vercel deploy --prod --force
```

## Estrutura atual
- **localhost:8089** - App principal
- **localhost:8090** - Proxy para HubSpot (proxy-local.js)
- **Vercel** - Usa `/api/hubspot-proxy` automaticamente

## Status
✅ Painel de Mídia funciona com dados offline (backup)
⏸ Sincronização HubSpot aguardando token válido
