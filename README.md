# 🛒 Checkout Page com IA

Uma página de checkout moderna com recursos de IA para análise de comportamento, detecção de fraude, otimização de entrega e recomendações personalizadas.

## 🚀 Funcionalidades

- **Análise de Comportamento**: Detecta padrões suspeitos em tempo real
- **Detecção de Fraude**: Calcula score de risco baseado no comportamento
- **Otimização de Entrega**: Sugere o melhor método de entrega
- **Recomendações de Produtos**: IA sugere produtos complementares
- **Chat Assistant**: Assistente de IA para dúvidas do checkout
- **Validação de Endereço**: IA valida e corrige endereços

## 🤖 Modos de IA Disponíveis

### 1. **Modo OpenAI** (Recomendado)
- Usa OpenAI GPT-3.5-turbo
- Análise mais precisa e contextual
- Requer chave da API OpenAI

**Configuração:**
```bash
# .env.local
NEXT_PUBLIC_AI_MODE=openai
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

### 2. **Modo OpenRouter** (Gratuito)
- Usa OpenRouter (serviço gratuito)
- Análise via múltiplos modelos de IA
- Requer chave da API OpenRouter

**Configuração:**
```bash
# .env.local
NEXT_PUBLIC_AI_MODE=openrouter
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key-here
NODE_ENV=development
```

### 3. **Modo Local** (Sem IA Externa)
- Usa regras pré-definidas
- Funciona sem conexão com APIs
- Resposta instantânea
- Análise básica mas funcional

**Configuração:**
```bash
# No arquivo .env.local
NEXT_PUBLIC_AI_MODE=local
```

## ⚙️ Como Configurar

### Passo 1: Escolha o Modo
Edite o arquivo `.env.local` na raiz do projeto:

```bash
# Abra o arquivo
nano .env.local
# ou
code .env.local
```

### Passo 2: Configure as Chaves de API

**Para OpenAI:**
```bash
NEXT_PUBLIC_AI_MODE=openai
NEXT_PUBLIC_OPENAI_API_KEY=sk-sua-chave-openai
```

**Para OpenRouter:**
```bash
NEXT_PUBLIC_AI_MODE=openrouter
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-sua-chave-openrouter
```

**Para Local:**
```bash
NEXT_PUBLIC_AI_MODE=local
```

### Passo 3: Reinicie o Servidor
```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
# ou
yarn dev
```

## 🔄 Como Trocar de Modo

### Método 1: Editar Manualmente
1. Abra o arquivo `.env.local`
2. Mude a linha `NEXT_PUBLIC_AI_MODE=`
3. Salve o arquivo
4. Recarregue a página

### Método 2: Comandos Rápidos
```bash
# Para OpenAI
sed -i '' 's/NEXT_PUBLIC_AI_MODE=.*/NEXT_PUBLIC_AI_MODE=openai/' .env.local

# Para OpenRouter
sed -i '' 's/NEXT_PUBLIC_AI_MODE=.*/NEXT_PUBLIC_AI_MODE=openrouter/' .env.local

# Para Local
sed -i '' 's/NEXT_PUBLIC_AI_MODE=.*/NEXT_PUBLIC_AI_MODE=local/' .env.local
```

## 🧪 Como Testar

1. **Recarregue a página** do checkout
2. **Interaja** com o checkout:
   - Mude o modo de entrega (Shipping/Pickup)
   - Altere quantidades de produtos
   - Remova itens do carrinho
   - Adicione produtos

3. **Verifique os logs** no console do navegador:
   ```
   🔍 Debug - AI Mode: openai
   Usando análise OpenAI
   ```

4. **Observe os cards de IA** que aparecem:
   - **Análise de Segurança**: Detecta comportamentos suspeitos
   - **Sugestões de Entrega**: Baseadas em mudanças de modo
   - **Recomendações**: Baseadas nos produtos no carrinho

## 📊 Comparação dos Modos

| Recurso | OpenAI | OpenRouter | Local |
|---------|--------|------------|-------|
| **Precisão** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Velocidade** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Custo** | 💰💰 | 💰 | 🆓 |
| **Confiabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Facilidade** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🔧 Desenvolvimento

### Estrutura dos Arquivos
```
lib/
├── ai-service.ts          # Serviço principal de IA
├── openai-service.ts      # Integração com OpenAI
├── openrouter-service.ts  # Integração com OpenRouter
└── ollama-service.ts      # Integração local (Ollama)

components/
├── ai-fraud-detector.tsx      # Card de detecção de fraude
├── ai-delivery-optimizer.tsx  # Card de otimização de entrega
├── ai-product-recommendations.tsx # Card de recomendações
└── ai-chat-assistant.tsx      # Chat assistant

hooks/
└── use-ai-checkout.ts     # Hook principal de IA
```

### Debug e Logs
Os logs de debug aparecem no console do navegador:
- `🔍 Debug - AI Mode:`: Mostra o modo atual
- `Usando análise [modo]`: Confirma qual serviço está sendo usado
- `OpenAI Analysis Result:`: Resultado da análise (modo OpenAI)

## 🚨 Troubleshooting

### Problema: "API key não configurada"
**Solução:** Verifique se a chave está correta no `.env.local`

### Problema: "Erro de rede"
**Solução:** Mude para modo `local` temporariamente

### Problema: Cards não aparecem
**Solução:** 
1. Verifique os logs no console
2. Interaja mais com o checkout
3. Recarregue a página

### Problema: Resposta lenta
**Solução:** 
1. Use modo `local` para resposta instantânea
2. Verifique a conexão com a internet
3. Tente OpenRouter como alternativa

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT. 