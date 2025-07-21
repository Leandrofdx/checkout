interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

interface OllamaRequest {
  model: string
  prompt: string
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    num_predict?: number
    num_ctx?: number
    num_thread?: number
    num_gpu?: number
  }
}

export class OllamaService {
  private static instance: OllamaService
  private baseUrl = 'http://localhost:11434'
  private model = 'llama2:7b-chat'

  static getInstance(): OllamaService {
    if (!OllamaService.instance) {
      OllamaService.instance = new OllamaService()
    }
    return OllamaService.instance
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            num_ctx: 128,        // Reduzido de 256 para 128
            num_thread: 1,
            num_gpu: 0,
            temperature: 0.7,
            top_k: 10,           // Adicionado para reduzir uso de memória
            top_p: 0.9,          // Adicionado para reduzir uso de memória
            ...options
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OllamaResponse = await response.json()
      return data.response
    } catch (error) {
      console.error('Erro ao gerar texto com Ollama:', error)
      throw error
    }
  }

  async analyzeBehavior(behaviorData: any): Promise<any> {
    const prompt = `
Analise este comportamento de checkout e retorne um JSON com análise de risco:

Dados do comportamento:
- Cliques: ${behaviorData.clicks || 0}
- Tempo na página: ${behaviorData.timeOnPage || 0}
- Mudanças de método de pagamento: ${behaviorData.paymentChanges || 0}
- Remoções de itens: ${behaviorData.itemRemovals || 0}

Retorne apenas um JSON válido com:
{
  "fraudScore": número de 0-100,
  "flags": ["lista", "de", "flags"],
  "riskLevel": "baixo|médio|alto",
  "suggestions": ["lista", "de", "sugestões"]
}
`

    const response = await this.generateText(prompt)
    
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      // Fallback se não conseguir extrair JSON
      return {
        fraudScore: 50,
        flags: ["análise_local"],
        riskLevel: "médio",
        suggestions: ["Verificar comportamento"]
      }
    } catch (error) {
      console.error('Erro ao parsear resposta:', error)
      return {
        fraudScore: 50,
        flags: ["erro_análise"],
        riskLevel: "médio",
        suggestions: ["Verificar comportamento"]
      }
    }
  }

  async getChatResponse(message: string, context: string = ''): Promise<string> {
    const prompt = `
Você é um assistente de checkout de e-commerce. Responda de forma amigável e útil.

Contexto: ${context}

Usuário: ${message}

Assistente:`

    return await this.generateText(prompt)
  }

  async validateAddress(address: string): Promise<any> {
    const prompt = `
Valide este endereço brasileiro e retorne um JSON:

Endereço: ${address}

Retorne apenas um JSON válido com:
{
  "isValid": true/false,
  "confidence": número de 0-100,
  "suggestions": ["sugestões", "de", "correção"],
  "normalizedAddress": "endereço normalizado"
}
`

    const response = await this.generateText(prompt)
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      return {
        isValid: true,
        confidence: 70,
        suggestions: [],
        normalizedAddress: address
      }
    } catch (error) {
      return {
        isValid: true,
        confidence: 70,
        suggestions: [],
        normalizedAddress: address
      }
    }
  }
} 