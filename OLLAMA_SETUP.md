# 🚀 Setup IA Local com Ollama

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Node.js 18+
- 8GB+ RAM disponível (para o modelo Llama 3.1)

## 🐳 Instalação e Configuração

### 1. Iniciar Ollama
```bash
# Executar script de setup
./scripts/setup-ollama.sh
```

### 2. Verificar se está funcionando
```bash
# Verificar se Ollama está rodando
curl http://localhost:11434/api/tags

# Verificar modelos disponíveis
curl http://localhost:11434/api/tags | jq '.models[] | .name'
```

### 3. Testar geração de texto
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "prompt": "Olá, como você está?",
    "stream": false
  }'
```

## 🔧 Configuração do Projeto

### 1. Atualizar .env.local
```bash
# Adicionar ao .env.local
NEXT_PUBLIC_AI_MODE=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

### 2. Integrar com o código
O serviço `OllamaService` já está criado em `lib/ollama-service.ts`

### 3. Adaptar ai-service.ts
Substituir chamadas OpenAI por Ollama quando `AI_MODE=ollama`

## 🎯 Funcionalidades

### ✅ Análise de Comportamento
- Detecção de fraudes
- Análise de padrões de clique
- Score de risco em tempo real

### ✅ Chat Assistant
- Conversas naturais em português
- Contexto do checkout
- Sugestões personalizadas

### ✅ Validação de Endereços
- Validação de formato
- Sugestões de correção
- Dados brasileiros

### ✅ Recomendações de Produtos
- Baseado no carrinho
- Análise de comportamento
- Sugestões personalizadas

## 🚨 Troubleshooting

### Ollama não inicia
```bash
# Verificar logs
docker-compose logs ollama

# Reiniciar
docker-compose restart ollama
```

### Modelo não baixa
```bash
# Baixar manualmente
curl -X POST http://localhost:11434/api/pull -d '{"name": "llama3.1:8b"}'
```

### Erro de conexão
```bash
# Verificar se porta está livre
lsof -i :11434

# Reiniciar Docker
docker-compose down && docker-compose up -d
```

## 📊 Performance

- **Modelo**: Llama 3.1 (8B parâmetros)
- **RAM**: ~4GB para o modelo
- **Latência**: ~2-5 segundos por requisição
- **Qualidade**: Muito boa para português

## 🔄 Comandos Úteis

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f ollama

# Reiniciar
docker-compose restart ollama
``` 