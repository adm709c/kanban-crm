# Firebase Setup - Sincronização na Nuvem

## 1. Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com
2. Clique "Criar projeto"
3. Nome: `kanban-crm-sync` (ou o que preferir)
4. Desabilite Google Analytics
5. Clique "Criar projeto"

## 2. Habilitar Firestore

1. No console Firebase, clique em "Firestore Database"
2. Clique "Criar banco de dados"
3. Modo: `Teste` (para desenvolvimento - depois mude para Produção)
4. Localização: `us-central1`
5. Clique "Criar"

## 3. Obter Credenciais

1. Na engrenagem (Settings) → "Project settings"
2. Abra a aba "Apps" e clique "</>" (adicionar app web)
3. Copie o `firebaseConfig`:
```javascript
const firebaseConfig = {
  apiKey: "...",
  projectId: "...",
  databaseURL: "..." // opcional para Firestore
};
```

## 4. Atualizar no index.html

Procure por:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDvWTyNq0WH_ZqK6qN5pL1Z8_0M1Z5Z5aA",
  projectId: "kanban-crm-sync",
  databaseURL: "https://kanban-crm-sync-default-rtdb.firebaseio.com"
};
```

E substitua pelas credenciais do seu projeto.

## 5. Regras de Segurança

No Firestore, vá para "Regras" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /devices/{deviceId} {
      allow read, write: if true;
    }
    match /sync/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ AVISO**: Essas regras são apenas para teste. Para produção, implemente autenticação adequada.

## 6. Como funciona

- Cada dispositivo recebe um ID único (salvo no localStorage)
- Dados sincronizam a cada 10 segundos
- Ao abrir em outro navegador/dispositivo, os dados são restaurados automaticamente
- Compartilhe apenas o device ID para que outros acessem os mesmos dados

