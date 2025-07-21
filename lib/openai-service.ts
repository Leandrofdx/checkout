interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenAIService {
  private static instance: OpenAIService
  private baseUrl = 'https://api.openai.com/v1'
  private apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || ''
  private model = 'gpt-3.5-turbo'

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService()
    }
    return OpenAIService.instance
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
          ...options
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OpenAIResponse = await response.json()
      return data.choices[0]?.message?.content || 'Erro na resposta'
    } catch (error) {
      console.error('Erro ao gerar texto com OpenAI:', error)
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
- Mudanças de entrega: ${behaviorData.deliveryChanges || 0}
- Mudanças de quantidade: ${behaviorData.quantityChanges || 0}

Produtos no carrinho: ${behaviorData.items ? JSON.stringify(behaviorData.items) : 'Não especificado'}

Retorne apenas um JSON válido com:
{
  "fraudScore": número de 0-100,
  "flags": ["lista", "de", "flags"],
  "riskLevel": "baixo|médio|alto",
  "suggestions": {
    "delivery": "express|pickup|standard ou null",
    "payment": "pix|credit|boleto ou null"
  },
  "recommendations": ["produto1", "produto2", "produto3"]
}

Considere os produtos específicos no carrinho para fazer recomendações relevantes.
`

    const response = await this.generateText(prompt)
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        console.log("OpenAI Analysis Result:", parsed)
        return parsed
      }
      
      // Fallback com estrutura correta
      return {
        fraudScore: 50,
        flags: ["análise_openai"],
        riskLevel: "médio",
        suggestions: {
          delivery: behaviorData.deliveryChanges >= 2 ? "express" : null,
          payment: behaviorData.paymentChanges >= 3 ? "pix" : null
        },
        recommendations: ["Cabo USB-C Premium", "Mouse Wireless", "Teclado Mecânico"]
      }
    } catch (error) {
      console.error('Erro ao parsear resposta:', error)
      return {
        fraudScore: 50,
        flags: ["erro_análise"],
        riskLevel: "médio",
        suggestions: {
          delivery: behaviorData.deliveryChanges >= 2 ? "express" : null,
          payment: behaviorData.paymentChanges >= 3 ? "pix" : null
        },
        recommendations: ["Produto Premium", "Acessório Essencial", "Item Complementar"]
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