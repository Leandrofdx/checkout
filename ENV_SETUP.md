# Configuração das Variáveis de Ambiente

## Como Configurar o .env

### 1. Criar o arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# Configuração do Modo de IA
NEXT_PUBLIC_AI_MODE=auto

# API Key da OpenAI
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here

# Outras configurações
NODE_ENV=development
```

### 2. Opções de Configuração da API Key

#### Opção A: NEXT_PUBLIC_OPENAI_API_KEY (Recomendado para desenvolvimento)
```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
```
- ✅ Funciona no cliente e servidor
- ✅ Fácil de configurar
- ⚠️ Visível no cliente (menos seguro)

#### Opção B: OPENAI_API_KEY (Mais seguro)
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```
- ✅ Mais seguro (não exposto ao cliente)
- ✅ Ideal para produção
- ⚠️ Pode não funcionar em algumas funcionalidades client-side

### 3. Prioridade de Carregamento

O sistema carrega a API key na seguinte ordem:
1. `NEXT_PUBLIC_OPENAI_API_KEY` (primeira prioridade)
2. `OPENAI_API_KEY` (segunda prioridade)
3. Token hardcoded (fallback)

### 4. Logs de Debug

O sistema mostra no console:
```
🔍 Debug - AI Mode: auto
🔍 Debug - API Key source: NEXT_PUBLIC_OPENAI_API_KEY
🔍 Debug - API Key carregada: ✅ Sim
🔍 Debug - AI_ENABLED: true
```

### 5. Exemplo de Configuração Completa

```bash
# .env.local
NEXT_PUBLIC_AI_MODE=auto
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

### 6. Segurança

- ✅ `.env.local` é ignorado pelo git
- ✅ Variáveis NEXT_PUBLIC_ são seguras para uso público
- ✅ Fallback para desenvolvimento sem configuração
- ⚠️ Nunca commite sua API key real

### 7. Para Produção

```bash
# .env.production
NEXT_PUBLIC_AI_MODE=auto
OPENAI_API_KEY=sk-your-production-api-key
NODE_ENV=production
```

## Testando a Configuração

1. Crie o arquivo `.env.local`
2. Adicione sua API key
3. Reinicie o servidor: `npm run dev`
4. Verifique os logs no console do navegador
5. Teste a funcionalidade de IA 