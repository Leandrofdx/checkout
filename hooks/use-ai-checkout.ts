"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AICheckoutService, type AIAnalysis } from "../lib/ai-service"
import type { CheckoutState } from "../types/checkout"

/**
 * Hook para IA do Checkout
 * 
 * IMPORTANTE: O chat só abre quando o usuário clica no botão.
 * A abertura automática foi desabilitada para melhor UX.
 * 
 * Funcionalidades:
 * - Análise de comportamento em tempo real
 * - Detecção de fraude
 * - Chat assistente (só por clique)
 * - Recomendações de produtos
 * - Validação de endereço
 */
export function useAICheckout(checkoutState: CheckoutState) {
  const [aiService, setAiService] = useState<AICheckoutService | null>(null)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [showChat, setShowChat] = useState(false)
  const abandonmentTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const isAnalyzingRef = useRef(false)
  const [isClient, setIsClient] = useState(false)

  // Initialize AI service only on client side
  useEffect(() => {
    setIsClient(true)
    const service = AICheckoutService.getInstance()
    setAiService(service)
    // Atualizar deviceInfo no cliente
    service.updateDeviceInfo()
  }, [])

  const analyzeCheckout = useCallback(async () => {
    if (!aiService || isAnalyzingRef.current || !isClient) return
    isAnalyzingRef.current = true
    try {
      const result = await aiService.analyzeCheckoutBehavior(checkoutState)
      setAnalysis(result)
      setRecommendations(result.recommendations)
      // Chat não abre automaticamente - só por clique do usuário
      // if (result.fraudScore > 70) {
      //   setShowChat(true)
      //   setChatMessages((prev) => [
      //     ...prev,
      //     {
      //       role: "assistant",
      //       content: "Notei algumas inconsistências. Posso ajudar a finalizar sua compra?",
      //     },
      //   ])
      // }
    } catch (err) {
      console.error("AI Analysis error:", err)
    } finally {
      isAnalyzingRef.current = false
    }
  }, [aiService, checkoutState, isClient])

  // 2. Chat Assistant
  const sendChatMessage = useCallback(
    async (message: string) => {
      if (!aiService) return

      setChatMessages((prev) => [...prev, { role: "user", content: message }])

      try {
        const response = await aiService.getChatResponse(message, checkoutState)
        setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
      } catch (error) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Desculpe, houve um erro. Como posso ajudar?",
          },
        ])
      }
    },
    [aiService, checkoutState],
  )

  // 3. Detecção de abandono (DESABILITADA - chat só abre por clique)
  const resetAbandonmentTimer = useCallback(() => {
    if (abandonmentTimerRef.current) {
      clearTimeout(abandonmentTimerRef.current)
    }

    // Timer desabilitado - chat só abre por clique do usuário
    // const timer = setTimeout(() => {
    //   setShowChat(true)
    //   setChatMessages((prev) => [
    //     ...prev,
    //     {
    //       role: "assistant",
    //       content: "Precisa de ajuda para finalizar sua compra? Estou aqui para ajudar! 😊",
    //     },
    //   ])
    // }, 30000) // 30 s de inatividade

    // abandonmentTimerRef.current = timer
  }, [])

  // 4. Validação inteligente de endereço
  const validateAddress = useCallback(
    async (address: string) => {
      if (!aiService) return { isValid: true }
      return await aiService.validateAddress(address)
    },
    [aiService],
  )

  // 5. Sugestão de endereço por CEP
  const getAddressByCEP = useCallback(
    async (cep: string) => {
      if (!aiService) return null
      return await aiService.getAddressSuggestion(cep)
    },
    [aiService],
  )

  // 6. Track de comportamento (ATUALIZAÇÃO EM TEMPO REAL)
  const trackAction = useCallback(
    (action: string, data?: any) => {
      if (!aiService) return
      aiService.trackBehavior(action, data)
      resetAbandonmentTimer()
      // re-analisa após breve atraso
      setTimeout(() => {
        analyzeCheckout()
      }, 100)
    },
    [aiService, resetAbandonmentTimer, analyzeCheckout],
  )

  // Effect – executa a 1ª análise e inicia o timer de abandono
  useEffect(() => {
    if (aiService && isClient) {
      analyzeCheckout()
      resetAbandonmentTimer()
    }

    // limpa o timer ao desmontar
    return () => {
      if (abandonmentTimerRef.current) clearTimeout(abandonmentTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutState.step, checkoutState.items, aiService, isClient])

  return {
    analysis,
    chatMessages,
    showChat,
    setShowChat,
    sendChatMessage,
    validateAddress,
    getAddressByCEP,
    recommendations,
    trackAction,
  }
}
