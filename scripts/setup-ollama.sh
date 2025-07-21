#!/bin/bash

echo "🚀 Iniciando setup da IA Local..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Iniciar Ollama
echo "🐳 Iniciando Ollama..."
docker-compose up -d

# Aguardar Ollama estar pronto
echo "⏳ Aguardando Ollama estar pronto..."
sleep 10

# Verificar se Ollama está rodando
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama está rodando!"
else
    echo "❌ Ollama não está respondendo. Aguardando mais tempo..."
    sleep 20
fi

# Baixar modelo Llama 3.1 (8B)
echo "📥 Baixando modelo Llama 3.1 (8B)..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "llama3.1:8b"}'

# Verificar modelos disponíveis
echo "📋 Modelos disponíveis:"
curl -s http://localhost:11434/api/tags | jq '.models[] | .name' 2>/dev/null || echo "Modelo ainda baixando..."

echo "🎉 Setup concluído! IA Local está pronta."
echo "🌐 API disponível em: http://localhost:11434"
echo "📚 Documentação: https://ollama.ai/library/llama3.1" 