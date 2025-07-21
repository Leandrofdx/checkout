# Configuração do Modo de IA

## Como Configurar

### 1. Modo Automático (Padrão)
```bash
# No arquivo .env.local
NEXT_PUBLIC_AI_MODE=auto
```
- **Comportamento**: Tenta OpenAI primeiro, se falhar usa análise local
- **Ideal para**: Desenvolvimento e produção

### 2. Modo OpenAI Forçado
```bash
# No arquivo .env.local
NEXT_PUBLIC_AI_MODE=openai
```
- **Comportamento**: Sempre tenta usar OpenAI
- **Ideal para**: Quando você tem crédito OpenAI disponível

### 3. Modo Local Forçado
```bash
# No arquivo .env.local
NEXT_PUBLIC_AI_MODE=local
```
- **Comportamento**: Sempre usa análise local
- **Ideal para**: Desenvolvimento sem custos ou quando OpenAI não está disponível

## Como Mudar o Modo

### Opção 1: Variável de Ambiente
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione: `NEXT_PUBLIC_AI_MODE=local` (ou `openai` ou `auto`)
3. Reinicie o servidor

### Opção 2: Direto no Código
Edite o arquivo `lib/ai-service.ts` linha 12:
```typescript
export const AI_MODE = "local" // ou "openai" ou "auto"
```

## Logs de Debug

O sistema mostra logs no console indicando qual modo está sendo usado:

- 🔄 **Usando análise local (modo configurado)**
- 🔄 **Usando OpenAI (modo configurado)**
- 🔄 **Fallback para análise local ativado**

## Benefícios de Cada Modo

### Modo Local
- ✅ **Sem custos**
- ✅ **Sem dependência externa**
- ✅ **Resposta instantânea**
- ❌ **Análise menos sofisticada**

### Modo OpenAI
- ✅ **Análise mais inteligente**
- ✅ **Respostas personalizadas**
- ✅ **Aprendizado contínuo**
- ❌ **Custos por requisição**
- ❌ **Dependência de internet**

### Modo Auto
- ✅ **Melhor dos dois mundos**
- ✅ **Fallback automático**
- ✅ **Flexibilidade total**
- ❌ **Pode ter latência no fallback** 