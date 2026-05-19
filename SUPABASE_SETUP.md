# Supabase Setup - Sincronização na Nuvem

## 1. Criar Projeto Supabase

1. Acesse: https://supabase.com
2. Clique "Sign up"
3. Use email ou GitHub
4. Clique "New project"
5. Nome: `kanban-crm-sync` (ou o que preferir)
6. Senha: crie uma senha forte
7. Region: `us-east-1` (ou mais próximo)
8. Clique "Create new project"

## 2. Criar Tabela de Dados

1. No painel Supabase, clique "SQL Editor"
2. Cole este código:

```sql
CREATE TABLE painel_dados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE painel_dados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON painel_dados
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. Clique "Execute"

## 3. Obter Credenciais

1. Clique em "Settings" (engrenagem)
2. Vá para "API"
3. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: `eyJhbGc...` (a chave pública)

## 4. Atualizar no index.html

Procure por `const SUPABASE_CONFIG` e atualize com:

```javascript
const SUPABASE_CONFIG = {
  url: "https://xxxxx.supabase.co",
  key: "eyJhbGc..."
};
```

## Como funciona

- Cada dispositivo tem um device_id único (salvo no localStorage)
- Dados salvos em tempo real na tabela `painel_dados`
- Ao abrir em outro navegador/dispositivo com mesmo device_id, os dados são restaurados
- Compartilhe o device_id para que outros acessem os mesmos dados

## Status

✅ Simples: sem configuração complexa de regras
✅ Real-time: sincroniza automaticamente
✅ PostgreSQL: dados estruturados

