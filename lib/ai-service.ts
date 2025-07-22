// Removido OpenAI - usando apenas OpenRouter
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

// --------------------------------------------------------------------
// 1)  Configuração - OpenAI, OpenRouter, Local
// --------------------------------------------------------------------
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY

// --------------------------------------------------------------------
// 2)  Configuração de modo de IA
// --------------------------------------------------------------------
export const AI_MODE = process.env.NEXT_PUBLIC_AI_MODE || "openrouter" // "openai", "openrouter", "local"
export const AI_ENABLED = Boolean(OPENAI_API_KEY || OPENROUTER_API_KEY)

// Debug para verificar configurações
console.log("🔍 Debug - AI Mode:", AI_MODE)
console.log("🔍 Debug - OpenAI API Key:", OPENAI_API_KEY ? "Configurada" : "Não configurada")
console.log("🔍 Debug - OpenRouter API Key:", OPENROUTER_API_KEY ? "Configurada" : "Não configurada")
console.log("🔍 Debug - AI_ENABLED:", AI_ENABLED)

export interface AIAnalysis {
  fraudScore: number
  recommendations: string[]
  suggestions: {
    delivery?: string
    payment?: string
    address?: string
  }
  behaviorFlags: string[]
}

export interface UserBehavior {
  timeOnPage: number
  clickPattern: string[]
  typingSpeed: number
  hesitationPoints: string[]
  deviceInfo: string
  deliveryModeChanges: number
  itemRemovals: number
  quantityChanges: number
  paymentMethodSelections: number
}

export class AICheckoutService {
  private static instance: AICheckoutService
  private userBehavior: UserBehavior = {
    timeOnPage: 0,
    clickPattern: [],
    typingSpeed: 0,
    hesitationPoints: [],
    deviceInfo: "Server", // Removido typeof navigator para evitar hidratação
    deliveryModeChanges: 0,
    itemRemovals: 0,
    quantityChanges: 0,
    paymentMethodSelections: 0,
  }

  static getInstance(): AICheckoutService {
    if (!AICheckoutService.instance) {
      AICheckoutService.instance = new AICheckoutService()
    }
    return AICheckoutService.instance
  }

  // Método para atualizar deviceInfo no cliente
  updateDeviceInfo() {
    // Removido typeof window para evitar hidratação
    // if (typeof window !== "undefined") {
    //   this.userBehavior.deviceInfo = navigator.userAgent
    // }
    this.userBehavior.deviceInfo = "Client"
  }

  async analyzeCheckoutBehavior(checkoutData: any): Promise<AIAnalysis> {
    // Verificar modo de IA
    if (AI_MODE === "local") {
      console.log("Usando análise local (modo configurado)")
      return this.getFallbackAnalysis()
    }

    if (AI_MODE === "openai") {
      console.log("Usando análise OpenAI")
      try {
        const { OpenAIService } = await import('./openai-service')
        const openai = OpenAIService.getInstance()
        
        const behaviorData = {
          clicks: this.userBehavior.clickPattern.length,
          timeOnPage: this.userBehavior.timeOnPage,
          paymentChanges: this.userBehavior.paymentMethodSelections,
          itemRemovals: this.userBehavior.itemRemovals,
          deliveryChanges: this.userBehavior.deliveryModeChanges,
          quantityChanges: this.userBehavior.quantityChanges,
          items: checkoutData.items || []
        }
        
        const analysis = await openai.analyzeBehavior(behaviorData)
        
        return {
          fraudScore: Math.min(analysis.fraudScore || 0, 100),
          recommendations: analysis.recommendations || [],
          suggestions: analysis.suggestions || {},
          behaviorFlags: analysis.flags || [],
        }
      } catch (error) {
        console.error("OpenAI Analysis failed:", error)
        throw error // Não usar fallback, deixar erro propagar
      }
    }

    // Usar OpenRouter para análise
    console.log("Usando análise OpenRouter")
    try {
      const { OpenRouterService } = await import('./openrouter-service')
      const openrouter = OpenRouterService.getInstance()
      
      const behaviorData = {
        clicks: this.userBehavior.clickPattern.length,
        timeOnPage: this.userBehavior.timeOnPage,
        paymentChanges: this.userBehavior.paymentMethodSelections,
        itemRemovals: this.userBehavior.itemRemovals,
        deliveryChanges: this.userBehavior.deliveryModeChanges,
        quantityChanges: this.userBehavior.quantityChanges,
        items: checkoutData.items || []
      }
      
      const analysis = await openrouter.analyzeBehavior(behaviorData)
      
      return {
        fraudScore: Math.min(analysis.fraudScore || 0, 100),
        recommendations: analysis.recommendations || [],
        suggestions: analysis.suggestions || {},
        behaviorFlags: analysis.flags || [],
      }
    } catch (error) {
      console.error("OpenRouter Analysis failed:", error)
      throw error // Não usar fallback, deixar erro propagar
    }
  }

  private getFallbackAnalysis(): AIAnalysis {
    let fraudScore = 0
    const behaviorFlags: string[] = []
    const suggestions: { delivery?: string; payment?: string; address?: string } = {}
    const recommendations: string[] = []

    // Análise local inteligente como fallback
    const totalClicks = this.userBehavior.clickPattern.length
    const deliveryChanges = this.userBehavior.deliveryModeChanges
    const itemRemovals = this.userBehavior.itemRemovals
    const quantityChanges = this.userBehavior.quantityChanges
    const paymentSelections = this.userBehavior.paymentMethodSelections

    // Cálculo do fraudScore baseado em comportamento
    if (totalClicks >= 20) {
      fraudScore += 30
      behaviorFlags.push("Atividade excessiva detectada")
    }

    if (itemRemovals >= 5) {
      fraudScore += 40
      behaviorFlags.push("Múltiplas remoções suspeitas")
    }

    if (quantityChanges >= 5) {
      fraudScore += 25
      behaviorFlags.push("Múltiplas alterações de quantidade")
    }

    if (paymentSelections >= 5) {
      fraudScore += 35
      behaviorFlags.push("Múltiplas alterações de pagamento")
    }

    // Sugestões inteligentes baseadas no comportamento
    if (deliveryChanges >= 2) {
      suggestions.delivery = "express"
    }

    if (paymentSelections >= 3) {
      suggestions.payment = "pix"
      behaviorFlags.push("Usuário testando métodos de pagamento")
    }

    // Recomendações baseadas no comportamento
    if (deliveryChanges >= 2) {
      recommendations.push("Cabo USB-C Premium", "Mouse Wireless", "Teclado Mecânico")
    }

    if (itemRemovals >= 3) {
      recommendations.push("Produto Similar", "Alternativa Econômica", "Versão Premium")
    }

    if (quantityChanges >= 3) {
      recommendations.push("Pacote com Desconto", "Quantidade Otimizada", "Combo Especial")
    }

    // Análise de padrões de comportamento
    if (totalClicks >= 15 && fraudScore < 50) {
      behaviorFlags.push("Usuário explorando opções")
    }

    console.log("Análise Local:", {
      fraudScore,
      behaviorFlags,
      suggestions,
      recommendations
    })

    return {
      fraudScore: Math.min(fraudScore, 100),
      recommendations,
      suggestions,
      behaviorFlags,
    }
  }

  async getChatResponse(message: string, context: any): Promise<string> {
    // Verificar modo de IA
    if (AI_MODE === "local") {
      console.log("Usando chat local (modo configurado)")
      return this.getFallbackChatResponse(message, context)
    }

    if (AI_MODE === "openai") {
      console.log("Usando chat OpenAI")
      try {
        const { OpenAIService } = await import('./openai-service')
        const openai = OpenAIService.getInstance()
        
        const contextStr = JSON.stringify({
          ...context,
          behavior: this.getBehaviorStats()
        })
        
        return await openai.getChatResponse(message, contextStr)
      } catch (error) {
        console.error("OpenAI Chat failed:", error)
        throw error // Não usar fallback, deixar erro propagar
      }
    }

    // Usar OpenRouter para chat
    console.log("Usando chat OpenRouter")
    try {
      const { OpenRouterService } = await import('./openrouter-service')
      const openrouter = OpenRouterService.getInstance()
      
      const contextStr = JSON.stringify({
        ...context,
        behavior: this.getBehaviorStats()
      })
      
      return await openrouter.getChatResponse(message, contextStr)
    } catch (error) {
      console.error("OpenRouter Chat failed:", error)
      throw error // Não usar fallback, deixar erro propagar
    }
  }

  private getFallbackChatResponse(message: string, context: any): string {
    const lowerMessage = message.toLowerCase()
    
    // Respostas inteligentes baseadas na mensagem
    if (lowerMessage.includes("ajuda") || lowerMessage.includes("help")) {
      return "Olá! Posso ajudar com: 📦 entrega, 💳 pagamento, 🛒 carrinho, 📱 suporte. O que você precisa?"
    }
    
    if (lowerMessage.includes("entrega") || lowerMessage.includes("delivery")) {
      return "🚚 Temos entrega express (1-2 dias), padrão (3-5 dias) e retirada na loja. Qual prefere?"
    }
    
    if (lowerMessage.includes("pagamento") || lowerMessage.includes("payment")) {
      return "💳 Aceitamos: PIX, cartão de crédito, boleto e Apple/Google Pay. Qual método você prefere?"
    }
    
    if (lowerMessage.includes("desconto") || lowerMessage.includes("discount")) {
      return "🎉 Use o código 'WELCOME10' para 10% de desconto na primeira compra!"
    }
    
    if (lowerMessage.includes("seguro") || lowerMessage.includes("security")) {
      return "🔒 Sua compra é 100% segura! Usamos criptografia SSL e não armazenamos dados sensíveis."
    }
    
    if (lowerMessage.includes("problema") || lowerMessage.includes("error")) {
      return "😔 Desculpe pelo problema! Pode me explicar melhor? Estou aqui para ajudar a resolver."
    }
    
    // Resposta padrão
    return "Olá! Como posso ajudar com sua compra hoje? 😊"
  }

  async validateAddress(address: string): Promise<{ isValid: boolean; suggestion?: string }> {
    // Verificar modo de IA
    if (AI_MODE === "local") {
      console.log("Usando validação local (modo configurado)")
      return this.getFallbackAddressValidation(address)
    }

    if (AI_MODE === "openai") {
      console.log("Usando validação OpenAI")
      try {
        const { OpenAIService } = await import('./openai-service')
        const openai = OpenAIService.getInstance()
        
        const result = await openai.validateAddress(address)
        
        return {
          isValid: result.isValid,
          suggestion: result.suggestions?.[0] || result.normalizedAddress
        }
      } catch (error) {
        console.error("OpenAI Address validation failed:", error)
        throw error // Não usar fallback, deixar erro propagar
      }
    }

    // Usar OpenRouter para validação
    console.log("Usando validação OpenRouter")
    try {
      const { OpenRouterService } = await import('./openrouter-service')
      const openrouter = OpenRouterService.getInstance()
      
      const result = await openrouter.validateAddress(address)
      
      return {
        isValid: result.isValid,
        suggestion: result.suggestions?.[0] || result.normalizedAddress
      }
    } catch (error) {
      console.error("OpenRouter Address validation failed:", error)
      throw error // Não usar fallback, deixar erro propagar
    }
  }

  private getFallbackAddressValidation(address: string): { isValid: boolean; suggestion?: string } {
    // Verificar se address é uma string válida
    if (!address || typeof address !== 'string') {
      console.log("Validação Local: address inválido", { address, type: typeof address })
      return { isValid: false, suggestion: "Digite um endereço válido" }
    }

    const cleanAddress = address.trim()
    
    // Validação básica de endereço
    const hasStreet = /rua|avenida|av\.|alameda|travessa|vila|bairro/i.test(cleanAddress)
    const hasCity = /Rio de janeiro|belo horizonte|salvador|brasília|curitiba|fortaleza|manaus|recife|porto alegre/i.test(cleanAddress)
    const hasState = /sp|rj|mg|ba|df|pr|ce|am|pe|rs/i.test(cleanAddress)
    const hasNumber = /\d/.test(cleanAddress)
    
    const isValid = cleanAddress.length >= 15 && (hasStreet || hasCity)
    
    let suggestion: string | undefined = undefined
    
    if (!isValid) {
      if (!hasStreet && !hasCity) {
        suggestion = `${cleanAddress}, New Yourk, USA`
      } else if (!hasState) {
        suggestion = `${cleanAddress}, USA`
      } else if (cleanAddress.length < 15) {
        suggestion = `${cleanAddress}, New Yourk, USA, 01234-567`
      }
    }
    
    console.log("Validação Local:", { address: cleanAddress, isValid, suggestion })
    
    return { isValid, suggestion }
  }

  async getProductRecommendations(items: any[]): Promise<string[]> {
    // Verificar modo de IA
    if (AI_MODE === "local") {
      console.log("Usando recomendações locais (modo configurado)")
      return this.getFallbackProductRecommendations(items)
    }

    if (!AI_ENABLED) {
      console.log("Fallback para recomendações locais (sem API key OpenRouter)")
      return this.getFallbackProductRecommendations(items)
    }

    try {
      // Removido OpenAI - usando apenas OpenRouter
      // const model = openai("gpt-4o")

      // const { text } = await generateText({
      //   model: model,
      //   prompt: `
      //   Baseado nestes itens do carrinho, sugira 3 produtos complementares:
      //   ${JSON.stringify(items)}
          
      //   Retorne APENAS um array JSON de nomes de produtos:
      //   ["produto1", "produto2", "produto3"]
          
      //   Sugira produtos que fazem sentido comprar junto com os itens do carrinho.
      // `,
      // })

      // return JSON.parse(text)
      return this.getFallbackProductRecommendations(items)
    } catch (error) {
      console.error("OpenAI Product recommendations failed:", error)
      console.log("Fallback para recomendações locais ativado")
      return this.getFallbackProductRecommendations(items)
    }
  }

  private getFallbackProductRecommendations(items: any[]): string[] {
    const recommendations: string[] = []
    
    // Análise dos itens no carrinho
    const itemNames = items.map(item => item.name?.toLowerCase() || "")
    const itemCategories = items.map(item => item.category?.toLowerCase() || "")
    
    // Detectar tipos de produtos
    const hasElectronics = itemNames.some(name => 
      name.includes("iphone") || name.includes("macbook") || name.includes("airpods") || 
      name.includes("apple watch") || name.includes("laptop") || name.includes("computer") || 
      name.includes("phone") || name.includes("cabo") || name.includes("mouse") || 
      name.includes("teclado") || name.includes("headphone")
    )
    
    const hasClothing = itemNames.some(name => 
      name.includes("shirt") || name.includes("pants") || name.includes("dress") || 
      name.includes("camisa") || name.includes("calça") || name.includes("vestido") ||
      name.includes("shoes") || name.includes("sneakers") || name.includes("jacket")
    )
    
    const hasBooks = itemNames.some(name => 
      name.includes("book") || name.includes("livro") || name.includes("text") ||
      name.includes("magazine") || name.includes("journal")
    )
    
    const hasHome = itemNames.some(name => 
      name.includes("furniture") || name.includes("lamp") || name.includes("couch") ||
      name.includes("table") || name.includes("chair") || name.includes("bed")
    )
    
    const hasSports = itemNames.some(name => 
      name.includes("gym") || name.includes("fitness") || name.includes("yoga") ||
      name.includes("running") || name.includes("basketball") || name.includes("soccer")
    )
    
    // Recomendações específicas baseadas no tipo de produto
    if (hasElectronics) {
      if (itemNames.some(name => name.includes("iphone"))) {
        recommendations.push("Apple MagSafe Charger", "iPhone 15 Pro Case", "Screen Protector")
      } else if (itemNames.some(name => name.includes("macbook"))) {
        recommendations.push("USB-C Hub", "MacBook Sleeve", "Wireless Mouse")
      } else if (itemNames.some(name => name.includes("airpods"))) {
        recommendations.push("AirPods Case", "Wireless Charger", "Bluetooth Speaker")
      } else {
        recommendations.push("USB-C Cable", "Wireless Charger", "Phone Stand")
      }
    } else if (hasClothing) {
      recommendations.push("Matching Belt", "Stylish Watch", "Designer Sunglasses")
    } else if (hasBooks) {
      recommendations.push("Premium Bookmark", "Reading Light", "Book Cover")
    } else if (hasHome) {
      recommendations.push("Smart Bulb", "Throw Pillow", "Wall Art")
    } else if (hasSports) {
      recommendations.push("Fitness Tracker", "Sports Water Bottle", "Gym Bag")
    } else {
      // Recomendações gerais baseadas no comportamento
      if (this.userBehavior.deliveryModeChanges >= 2) {
        recommendations.push("Express Delivery Upgrade", "Premium Packaging", "Gift Wrapping")
      } else if (this.userBehavior.itemRemovals >= 3) {
        recommendations.push("Budget Alternative", "Similar Product", "Economic Version")
      } else {
        recommendations.push("Premium Accessory", "Essential Add-on", "Popular Item")
      }
    }
    
    // Adicionar recomendações baseadas no comportamento
    if (this.userBehavior.deliveryModeChanges >= 2) {
      recommendations[0] = "Express Delivery Upgrade"
    }
    
    if (this.userBehavior.itemRemovals >= 3) {
      recommendations[1] = "Budget Alternative"
    }
    
    if (this.userBehavior.quantityChanges >= 3) {
      recommendations[2] = "Bulk Discount Package"
    }
    
    console.log("Recomendações Locais:", recommendations)
    
    return recommendations
  }

  trackBehavior(action: string, data?: any) {
    this.userBehavior.clickPattern.push(action)
    // Removido Date.now() para evitar hidratação
    // this.userBehavior.timeOnPage = Date.now()

    if (action === "delivery_mode_change") {
      this.userBehavior.deliveryModeChanges++
    }

    if (action === "remove_item") {
      this.userBehavior.itemRemovals++
    }

    if (action === "quantity_change") {
      this.userBehavior.quantityChanges++
    }

    if (action === "payment_method_select") {
      this.userBehavior.paymentMethodSelections++
    }

    if (action === "hesitation") {
      this.userBehavior.hesitationPoints.push(data)
    }

    console.log(
      `🤖 OpenAI Tracking: ${action} | Cliques: ${this.userBehavior.clickPattern.length} | Delivery: ${this.userBehavior.deliveryModeChanges} | Remoções: ${this.userBehavior.itemRemovals} | Qty: ${this.userBehavior.quantityChanges} | Payment: ${this.userBehavior.paymentMethodSelections}`,
    )
  }

  getBehaviorStats() {
    return {
      totalClicks: this.userBehavior.clickPattern.length,
      deliveryModeChanges: this.userBehavior.deliveryModeChanges,
      itemRemovals: this.userBehavior.itemRemovals,
      quantityChanges: this.userBehavior.quantityChanges,
      paymentMethodSelections: this.userBehavior.paymentMethodSelections,
    }
  }

  async getAddressSuggestion(cep: string): Promise<any> {
    // Verificar modo de IA
    if (AI_MODE === "local") {
      console.log("Usando sugestão de endereço local (modo configurado)")
      const cepData = {
        "10036": {
          street: "1535 Broadway",
          city: "New York",
          state: "NY",
          country: "USA",
        },
      }
      return cepData[cep as keyof typeof cepData] || null
    }

    if (!AI_ENABLED) {
      console.log("Fallback para sugestão local (sem API key OpenRouter)")
      const cepData = {
        "10036": {
          street: "1535 Broadway",
          city: "New York",
          state: "NY",
          country: "USA",
        },
      }
      return cepData[cep as keyof typeof cepData] || null
    }

    try {
      // Removido OpenAI - usando apenas OpenRouter
      // const model = openai("gpt-4o")

      // const { text } = await generateText({
      //   model: model,
      //   prompt: `
      //   Simule uma consulta de CEP brasileiro para: ${cep}
          
      //   Retorne APENAS um JSON válido:
      //   {"street": "nome da rua", "city": "cidade", "state": "estado", "country": "Brasil"}
          
      //   Se o CEP não for válido, retorne null.
      //   Use dados realistas para CEPs brasileiros.
      // `,
      // })

      // return JSON.parse(text)
      return null
    } catch (error) {
      console.error("OpenAI CEP lookup failed:", error)
      return null
    }
  }
}