"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Volume2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { CheckoutState } from "../types/checkout"

// Declarações de tipo para SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface VoiceCommanderProps {
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
  trackAction: (action: string, data?: any) => void
}

export function VoiceCommander({ state, onUpdateState, trackAction }: VoiceCommanderProps) {
  const [isListening, setIsListening] = useState(true) // Ativado por padrão
  const [isAlwaysListening, setIsAlwaysListening] = useState(true) // Sempre ouvindo passivamente
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info")
  const [lastProcessedCommand, setLastProcessedCommand] = useState("")
  const [lastProcessedTime, setLastProcessedTime] = useState(0)
  
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o navegador suporta SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    // Evitar múltiplas inicializações
    if (recognitionRef.current) {
      return
    }

    // Inicializar reconhecimento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'pt-BR'

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript("")
      console.log("🎤 SpeechRecognition iniciado - ouvindo comandos")
      showFeedbackMessage("Comandos de voz ativados!", "success")
    }

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        const isFinal = event.results[i].isFinal
        if (isFinal) {
          finalTranscript += transcript
        }
      }

      setTranscript(finalTranscript)
      
      // Processar imediatamente se há resultado final
      if (finalTranscript.trim()) {
        // Verificar se é o mesmo comando recentemente processado
        const now = Date.now()
        const timeSinceLastCommand = now - lastProcessedTime
        const isSameCommand = finalTranscript.trim().toLowerCase() === lastProcessedCommand.toLowerCase()
        
        // Só processar se for um comando diferente ou se passou mais de 2 segundos
        if (!isSameCommand || timeSinceLastCommand > 2000) {
          // Usar setTimeout para evitar problemas de concorrência
          setTimeout(() => {
            processVoiceCommand(finalTranscript.trim())
            setLastProcessedCommand(finalTranscript.trim())
            setLastProcessedTime(now)
          }, 100)
        }
        
        // Limpar transcript após processar para não acumular
        setTranscript("")
      }
    }

    recognitionRef.current.onend = () => {
      // Não reiniciar automaticamente - deixar o usuário controlar
      setIsListening(false)
      console.log("🛑 SpeechRecognition parou")
    }

    recognitionRef.current.onerror = (event: any) => {
      console.log("❌ Erro no SpeechRecognition:", event.error)
      setIsListening(false)
    }

    // Iniciar automaticamente se sempre deve estar ouvindo
    if (isAlwaysListening) {
      try {
        // Iniciar imediatamente na primeira vez
        recognitionRef.current.start()
        console.log("🎤 SpeechRecognition iniciado com sucesso")
      } catch (error) {
        console.log("⚠️ SpeechRecognition já está ativo, ignorando start inicial")
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.log("⚠️ SpeechRecognition já está parado")
        }
      }
    }
  }, [isAlwaysListening])

  // useEffect adicional para garantir inicialização na primeira carga
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAlwaysListening && recognitionRef.current && !isListening) {
        try {
          recognitionRef.current.start()
          console.log("🎤 SpeechRecognition iniciado via timer")
        } catch (error) {
          console.log("⚠️ SpeechRecognition já está ativo")
        }
      }
    }, 1000) // Aguardar 1 segundo para garantir que tudo está carregado

    return () => clearTimeout(timer)
  }, [isAlwaysListening, isListening])

  const startListening = () => {
    setIsAlwaysListening(true)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        trackAction("voice_command_start")
      } catch (error) {
        console.log("⚠️ SpeechRecognition já está ativo")
      }
    }
  }

  const stopListening = () => {
    setIsAlwaysListening(false)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
        trackAction("voice_command_stop")
      } catch (error) {
        console.log("⚠️ SpeechRecognition já está parado")
      }
    }
  }

  const showFeedbackMessage = (message: string, type: "success" | "error" | "info") => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    setShowFeedback(true)
    
    setTimeout(() => setShowFeedback(false), 3000)
  }

  const confirmNavigation = (currentStep: string, targetStep: string) => {
    console.log("🔍 Confirmação de navegação:", { from: currentStep, to: targetStep })
    
    // Verificar se a navegação é válida baseada no breadcrumb
    const stepOrder = ["cart", "shipping", "payment"]
    const currentIndex = stepOrder.indexOf(currentStep)
    const targetIndex = stepOrder.indexOf(targetStep)
    
    if (currentIndex === -1 || targetIndex === -1) {
      console.error("❌ Navegação inválida:", { currentStep, targetStep })
      return false
    }
    
    // Permitir navegação para frente ou para trás
    const isValidNavigation = Math.abs(targetIndex - currentIndex) === 1
    console.log("🔍 Navegação válida:", isValidNavigation)
    
    return isValidNavigation
  }

  const navigateToStep = (step: string) => {
    console.log("🔍 Navegando para:", step)
    
    // Parar o reconhecimento de voz
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        console.log("⏸️ SpeechRecognition pausado")
      } catch (error) {
        console.log("⚠️ Erro ao pausar SpeechRecognition")
      }
    }
    
    // Navegar para a página
    router.push(`/${step}`)
  }

  const getCurrentStepInfo = () => {
    const stepOrder = ["cart", "shipping", "payment"]
    const currentIndex = stepOrder.indexOf(state.step)
    const stepNames = ["Cart", "Shipping", "Payment"]
    
    console.log("🔍 Estado atual:", {
      step: state.step,
      index: currentIndex,
      name: stepNames[currentIndex],
      isFirst: currentIndex === 0,
      isLast: currentIndex === stepOrder.length - 1
    })
    
    return {
      step: state.step,
      index: currentIndex,
      name: stepNames[currentIndex],
      isFirst: currentIndex === 0,
      isLast: currentIndex === stepOrder.length - 1
    }
  }

  const processVoiceCommand = (command: string) => {
    // Verificar se já está processando
    if (isProcessing) {
      console.log("⚠️ Já processando comando, ignorando:", command)
      return
    }
    
    setIsProcessing(true)
    const lowerCommand = command.toLowerCase()
    
    console.log("🎤 Processando comando:", command)
    
    try {
      // Wake word para ativar comandos de voz
      if (lowerCommand.includes("voz") || lowerCommand.includes("shopease") || lowerCommand.includes("shop ease") || 
          lowerCommand.includes("compras") || lowerCommand.includes("loja") ||
          lowerCommand.includes("checkout") || lowerCommand.includes("assistente")) {
        if (!isListening) {
          setIsListening(true)
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start()
              console.log("🎤 SpeechRecognition reativado")
            } catch (error) {
              console.log("⚠️ Erro ao reativar SpeechRecognition")
            }
          }
          showFeedbackMessage("Comandos de voz ativados! Fale seu comando...", "success")
        } else {
          showFeedbackMessage("Já estou ouvindo! Fale seu comando...", "info")
        }
        return
      }
      
      // Comando para desativar comandos de voz
      if (lowerCommand.includes("desativar") || lowerCommand.includes("parar") || lowerCommand.includes("sair") || 
          lowerCommand.includes("stop") || lowerCommand.includes("exit") || lowerCommand.includes("tchau")) {
        if (isListening) {
          setIsListening(false)
          showFeedbackMessage("Comandos de voz desativados!", "success")
        } else {
          showFeedbackMessage("Comandos de voz já estão desativados!", "info")
        }
        return
      }
      
      // Só processar outros comandos se estiver ativo
      if (!isListening) {
        return // Ignora todos os outros comandos se não estiver ativo
      }
      
      // Teste muito simples - qualquer comando que contenha "teste"
      if (lowerCommand.includes("teste")) {
        onUpdateState({ expressDelivery: !state.expressDelivery })
        showFeedbackMessage("Teste executado!", "success")
        return
      }
      
      // Teste para qualquer comando que contenha "oi"
      if (lowerCommand.includes("oi")) {
        showFeedbackMessage("Olá! Comando reconhecido!", "success")
        return
      }
      
      // Teste para qualquer comando que contenha "ping"
      if (lowerCommand.includes("ping")) {
        showFeedbackMessage("Pong! Comando funcionando!", "success")
        return
      }
      
      // Teste para qualquer comando que contenha "status"
      if (lowerCommand.includes("status")) {
        showFeedbackMessage(`Status: ${state.items.length} itens no carrinho`, "info")
        return
      }
      
      // Teste para qualquer comando que contenha "hello"
      if (lowerCommand.includes("hello")) {
        showFeedbackMessage("Hello! Comando reconhecido!", "success")
        return
      }
      
      // Teste direto para verificar se onUpdateState funciona
      if (lowerCommand.includes("teste2")) {
        onUpdateState({ items: [...state.items, {
          id: `teste-${Date.now()}`,
          name: "Produto Teste",
          price: 99.99,
          originalPrice: 129.99,
          quantity: 1,
          image: "",
          category: "Test",
          deliveryType: "shipping" as const
        }]})
        showFeedbackMessage("Teste2 executado!", "success")
        return
      }
      
      // Teste específico para quantidade
      if (lowerCommand.includes("teste3")) {
        if (state.items.length > 0) {
          const firstItem = state.items[0]
          changeQuantity(firstItem.name, 3)
          showFeedbackMessage("Teste3 executado!", "success")
        } else {
          showFeedbackMessage("Carrinho vazio para teste!", "error")
        }
        return
      }
      
      // Teste específico para MacBook
      if (lowerCommand.includes("teste macbook")) {
        changeQuantity("MacBook Air M2 - 13 inch", 2)
        showFeedbackMessage("Teste MacBook executado!", "success")
        return
      }
      
      // Teste específico para AirPods
      if (lowerCommand.includes("teste airpods")) {
        changeQuantity("AirPods Pro 2nd Generation", 3)
        showFeedbackMessage("Teste AirPods executado!", "success")
        return
      }
      
      // Teste para verificar estado atual
      if (lowerCommand.includes("verificar estado")) {
        showFeedbackMessage(`Carrinho tem ${state.items.length} itens`, "info")
        return
      }
      
      // Teste específico para verificar produtos
      if (lowerCommand.includes("verificar produtos")) {
        showFeedbackMessage(`Verificando ${state.items.length} produtos no console`, "info")
        return
      }
      
      // Teste específico para comandos de entrega
      if (lowerCommand.includes("teste pickup")) {
        onUpdateState({ deliveryMode: "pickup" })
        showFeedbackMessage("Teste pickup executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste shipping")) {
        onUpdateState({ deliveryMode: "shipping" })
        showFeedbackMessage("Teste shipping executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste entrega")) {
        showFeedbackMessage(`Modo atual: ${state.deliveryMode}`, "info")
        return
      }
      
      // Teste específico para pronúncias
      if (lowerCommand.includes("teste pique")) {
        onUpdateState({ deliveryMode: "pickup" })
        showFeedbackMessage("Teste pique (pickup) executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste xipping")) {
        onUpdateState({ deliveryMode: "shipping" })
        showFeedbackMessage("Teste xipping (shipping) executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste buscar")) {
        onUpdateState({ deliveryMode: "pickup" })
        showFeedbackMessage("Teste buscar (pickup) executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste entregar")) {
        onUpdateState({ deliveryMode: "shipping" })
        showFeedbackMessage("Teste entregar (shipping) executado!", "success")
        return
      }
      
      // Teste para novas variações
      if (lowerCommand.includes("teste picape")) {
        onUpdateState({ deliveryMode: "pickup" })
        showFeedbackMessage("Teste picape (pickup) executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste pick up")) {
        onUpdateState({ deliveryMode: "pickup" })
        showFeedbackMessage("Teste pick up (pickup) executado!", "success")
        return
      }
      
      if (lowerCommand.includes("teste chip")) {
        onUpdateState({ deliveryMode: "shipping" })
        showFeedbackMessage("Teste chip (shipping) executado!", "success")
        return
      }
      
      // Comandos para adicionar produtos
      if (lowerCommand.includes("adicione") || lowerCommand.includes("adicionar") || lowerCommand.includes("adiciona")) {
        if (lowerCommand.includes("macbook") || lowerCommand.includes("mac book")) {
          addProduct("MacBook Air M2 - 13 inch")
          showFeedbackMessage("MacBook adicionado ao carrinho!", "success")
          return
        } else if (lowerCommand.includes("iphone") || lowerCommand.includes("i phone")) {
          addProduct("iPhone 15 Pro Max - 256GB")
          showFeedbackMessage("iPhone adicionado ao carrinho!", "success")
          return
        } else if (lowerCommand.includes("airpods") || lowerCommand.includes("air pods") || lowerCommand.includes("airpods pro")) {
          addProduct("AirPods Pro 2nd Generation")
          showFeedbackMessage("AirPods adicionados ao carrinho!", "success")
          return
        } else if (lowerCommand.includes("watch") || lowerCommand.includes("relógio") || lowerCommand.includes("relogio")) {
          addProduct("Apple Watch Series 9 - 45mm")
          showFeedbackMessage("Apple Watch adicionado ao carrinho!", "success")
          return
        } else {
          showFeedbackMessage("Produto não reconhecido. Tente: iPhone, MacBook, AirPods ou Watch", "error")
          return
        }
      }
      
      // Comandos para remover produtos
      else if (lowerCommand.includes("remova") || lowerCommand.includes("remover") || lowerCommand.includes("remove")) {
        if (lowerCommand.includes("macbook") || lowerCommand.includes("mac book")) {
          removeProduct("MacBook Air M2 - 13 inch")
          showFeedbackMessage("MacBook removido do carrinho!", "success")
          return
        } else if (lowerCommand.includes("iphone") || lowerCommand.includes("i phone")) {
          removeProduct("iPhone 15 Pro Max - 256GB")
          showFeedbackMessage("iPhone removido do carrinho!", "success")
          return
        } else if (lowerCommand.includes("airpods") || lowerCommand.includes("air pods") || lowerCommand.includes("airpods pro")) {
          removeProduct("AirPods Pro 2nd Generation")
          showFeedbackMessage("AirPods removidos do carrinho!", "success")
          return
        } else if (lowerCommand.includes("watch") || lowerCommand.includes("relógio") || lowerCommand.includes("relogio")) {
          removeProduct("Apple Watch Series 9 - 45mm")
          showFeedbackMessage("Apple Watch removido do carrinho!", "success")
          return
        } else {
          showFeedbackMessage("Produto não encontrado para remoção", "error")
          return
        }
      }
      
      // Comandos para mudar quantidade
      else if (lowerCommand.includes("quantidade") || lowerCommand.includes("mude") || lowerCommand.includes("muda") || lowerCommand.includes("altere") || lowerCommand.includes("mudar")) {
        // Função para converter números por extenso
        const convertNumberFromText = (text: string) => {
          const numberMap: { [key: string]: number } = {
            'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 'tres': 3,
            'quatro': 4, 'cinco': 5, 'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10,
            'onze': 11, 'doze': 12, 'treze': 13, 'quatorze': 14, 'quinze': 15,
            'dezesseis': 16, 'dezessete': 17, 'dezoito': 18, 'dezenove': 19, 'vinte': 20
          }
          
          // Primeiro tenta encontrar números digitais
          const digitMatch = text.match(/(\d+)/)
          if (digitMatch) {
            return parseInt(digitMatch[1])
          }
          
          // Depois tenta encontrar números por extenso
          for (const [word, number] of Object.entries(numberMap)) {
            if (text.includes(word)) {
              return number
            }
          }
          
          return null
        }
        
        const quantity = convertNumberFromText(lowerCommand)
        
        if (quantity !== null) {
          if (lowerCommand.includes("macbook") || lowerCommand.includes("mac book")) {
            changeQuantity("MacBook Air M2 - 13 inch", quantity)
            showFeedbackMessage(`Quantidade do MacBook alterada para ${quantity}!`, "success")
            return
          } else if (lowerCommand.includes("iphone") || lowerCommand.includes("i phone")) {
            changeQuantity("iPhone 15 Pro Max - 256GB", quantity)
            showFeedbackMessage(`Quantidade do iPhone alterada para ${quantity}!`, "success")
            return
          } else if (lowerCommand.includes("airpods") || lowerCommand.includes("air pods") || lowerCommand.includes("airpods pro")) {
            changeQuantity("AirPods Pro 2nd Generation", quantity)
            showFeedbackMessage(`Quantidade dos AirPods alterada para ${quantity}!`, "success")
            return
          } else if (lowerCommand.includes("watch") || lowerCommand.includes("relógio") || lowerCommand.includes("relogio")) {
            changeQuantity("Apple Watch Series 9 - 45mm", quantity)
            showFeedbackMessage(`Quantidade do Apple Watch alterada para ${quantity}!`, "success")
            return
          } else {
            showFeedbackMessage("Produto não reconhecido para alterar quantidade", "error")
            return
          }
        } else {
          showFeedbackMessage("Quantidade não especificada", "error")
          return
        }
      }
      
      // Comandos para mudar modo de entrega (mais específicos - devem vir ANTES dos comandos de navegação)
      else if (lowerCommand.includes("mude para pickup") || lowerCommand.includes("mude para loja") || lowerCommand.includes("mude para retirada") || 
               lowerCommand.includes("muda para pickup") || lowerCommand.includes("muda para loja") || lowerCommand.includes("muda para retirada") ||
               lowerCommand.includes("altere para pickup") || lowerCommand.includes("altere para loja") || lowerCommand.includes("altere para retirada") ||
               lowerCommand.includes("mude para pique") || lowerCommand.includes("muda para pique") || lowerCommand.includes("altere para pique") ||
               lowerCommand.includes("mude para picape") || lowerCommand.includes("muda para picape") || lowerCommand.includes("altere para picape") ||
               lowerCommand.includes("mude para pick up") || lowerCommand.includes("muda para pick up") || lowerCommand.includes("altere para pick up")) {
        // Simular clique no botão pickup
        const pickupButton = document.querySelector('[data-delivery-mode="pickup"]') as HTMLElement
        if (pickupButton) {
          pickupButton.click()
        } else {
          // Fallback: atualizar estado diretamente
          onUpdateState({ deliveryMode: "pickup" })
        }
        showFeedbackMessage("Modo alterado para retirada na loja!", "success")
        return
      } 
      else if (lowerCommand.includes("mude para shipping") || lowerCommand.includes("mude para envio") || lowerCommand.includes("mude para casa") ||
               lowerCommand.includes("muda para shipping") || lowerCommand.includes("muda para envio") || lowerCommand.includes("muda para casa") ||
               lowerCommand.includes("altere para shipping") || lowerCommand.includes("altere para envio") || lowerCommand.includes("altere para casa") ||
               lowerCommand.includes("mude para xipping") || lowerCommand.includes("muda para xipping") || lowerCommand.includes("altere para xipping") ||
               lowerCommand.includes("mude para chipping") || lowerCommand.includes("muda para chipping") || lowerCommand.includes("altere para chipping") ||
               lowerCommand.includes("mude para xiping") || lowerCommand.includes("muda para xiping") || lowerCommand.includes("altere para xiping") ||
               lowerCommand.includes("mude para chip") || lowerCommand.includes("muda para chip") || lowerCommand.includes("altere para chip")) {
        // Simular clique no botão shipping
        const shippingButton = document.querySelector('[data-delivery-mode="shipping"]') as HTMLElement
        if (shippingButton) {
          shippingButton.click()
        } else {
          // Fallback: atualizar estado diretamente
          onUpdateState({ deliveryMode: "shipping" })
        }
        showFeedbackMessage("Modo alterado para entrega em casa!", "success")
        return
      }
      // Comandos simples para entrega (mais específicos)
      else if ((lowerCommand.includes("pickup") || lowerCommand.includes("loja") || lowerCommand.includes("retirada") || 
                lowerCommand.includes("pique") || lowerCommand.includes("picape") || lowerCommand.includes("pick up") ||
                lowerCommand.includes("buscar") || lowerCommand.includes("busca") || lowerCommand.includes("pegar") || lowerCommand.includes("pega")) && 
               !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima") && !lowerCommand.includes("avançar") && !lowerCommand.includes("avancar")) {
        // Simular clique no botão pickup
        const pickupButton = document.querySelector('[data-delivery-mode="pickup"]') as HTMLElement
        if (pickupButton) {
          pickupButton.click()
        } else {
          // Fallback: atualizar estado diretamente
          onUpdateState({ deliveryMode: "pickup" })
        }
        showFeedbackMessage("Modo alterado para retirada na loja!", "success")
        return
      } 
      else if ((lowerCommand.includes("shipping") || lowerCommand.includes("envio") || lowerCommand.includes("casa") || 
                lowerCommand.includes("xipping") || lowerCommand.includes("chipping") || lowerCommand.includes("xiping") ||
                lowerCommand.includes("chip") || lowerCommand.includes("entregar") || lowerCommand.includes("entrega") || lowerCommand.includes("mandar") ||
                lowerCommand.includes("enviar") || lowerCommand.includes("enviar")) && 
               !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima") && !lowerCommand.includes("avançar") && !lowerCommand.includes("avancar")) {
        // Simular clique no botão shipping
        const shippingButton = document.querySelector('[data-delivery-mode="shipping"]') as HTMLElement
        if (shippingButton) {
          shippingButton.click()
        } else {
          // Fallback: atualizar estado diretamente
          onUpdateState({ deliveryMode: "shipping" })
        }
        showFeedbackMessage("Modo alterado para entrega em casa!", "success")
        return
      }
      
      // Comandos para métodos de pagamento na tela de Payment (DEVE VIR ANTES dos comandos de navegação)
      else if (lowerCommand.includes("cartão") || lowerCommand.includes("cartao") || lowerCommand.includes("credito") || lowerCommand.includes("crédito")) {
        const creditButton = document.querySelector('[data-voice-action="payment-credit"]') as HTMLElement
        if (creditButton) {
          creditButton.click()
          showFeedbackMessage("Método de pagamento alterado para cartão!", "success")
        } else {
          onUpdateState({ paymentMethod: "credit" })
          showFeedbackMessage("Método de pagamento alterado para cartão!", "success")
        }
        return
      } else if ((lowerCommand.includes("pix") || lowerCommand.includes("pics") || lowerCommand.includes("pix payment") || lowerCommand.includes("método pix") || lowerCommand.includes("metodo pix")) && !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima")) {
        const pixButton = document.querySelector('[data-voice-action="payment-pix"]') as HTMLElement
        if (pixButton) {
          pixButton.click()
          showFeedbackMessage("Método de pagamento alterado para PIX!", "success")
        } else {
          onUpdateState({ paymentMethod: "pix" })
          showFeedbackMessage("Método de pagamento alterado para PIX!", "success")
        }
        return
      } else if (lowerCommand.includes("boleto")) {
        const boletoButton = document.querySelector('[data-voice-action="payment-boleto"]') as HTMLElement
        if (boletoButton) {
          boletoButton.click()
          showFeedbackMessage("Método de pagamento alterado para boleto bancário!", "success")
        } else {
          onUpdateState({ paymentMethod: "boleto" })
          showFeedbackMessage("Método de pagamento alterado para boleto bancário!", "success")
        }
        return
      } else if (lowerCommand.includes("pagar") || lowerCommand.includes("pague agora") || lowerCommand.includes("buy now")) {
        const buyNowButton = document.querySelector('[data-voice-action="buy-now"]') as HTMLElement
        if (buyNowButton) {
          buyNowButton.click()
          showFeedbackMessage("Pagamento processado!", "success")
        } else {
          // Navegar diretamente para a página de sucesso
          router.push("/success")
          showFeedbackMessage("Pagamento processado! Redirecionando...", "success")
        }
        return
      }
      
      // Comandos para navegação com verificações baseadas no breadcrumb real
      else if (lowerCommand.includes("próxima") || lowerCommand.includes("proxima") || lowerCommand.includes("avançar") || lowerCommand.includes("avancar") || lowerCommand.includes("próximo") || lowerCommand.includes("proximo") || lowerCommand.includes("continuar")) {
        // Verificar estado atual
        const currentInfo = getCurrentStepInfo()
        console.log("🔍 Debug - Navegação próxima:", currentInfo)
        
        if (currentInfo.isLast) {
          showFeedbackMessage(`Já está na última página (${currentInfo.name})!`, "info")
        } else {
          const stepOrder = ["cart", "shipping", "payment"]
          const nextStep = stepOrder[currentInfo.index + 1] as "cart" | "shipping" | "payment"
          
          if (confirmNavigation(state.step, nextStep)) {
            navigateToStep(nextStep)
            showFeedbackMessage(`Avançando para ${stepOrder[currentInfo.index + 1]}!`, "success")
          }
        }
        return
      } else if ((lowerCommand.includes("voltar") || lowerCommand.includes("anterior") || lowerCommand.includes("volta")) && 
                 !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima") && !lowerCommand.includes("avançar") && !lowerCommand.includes("avancar")) {
        // Verificar estado atual
        const currentInfo = getCurrentStepInfo()
        console.log("🔍 Debug - Navegação voltar:", currentInfo)
        
        if (currentInfo.isFirst) {
          showFeedbackMessage(`Já está na primeira página (${currentInfo.name})!`, "info")
        } else {
          const stepOrder = ["cart", "shipping", "payment"]
          const prevStep = stepOrder[currentInfo.index - 1] as "cart" | "shipping" | "payment"
          
          if (confirmNavigation(state.step, prevStep)) {
            navigateToStep(prevStep)
            showFeedbackMessage(`Voltando para ${stepOrder[currentInfo.index - 1]}!`, "success")
          }
        }
        return
      }
      
      // Comandos para navegação específica
      else if ((lowerCommand.includes("pagamento") || lowerCommand.includes("payment")) && 
               !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima") && !lowerCommand.includes("avançar") && !lowerCommand.includes("avancar")) {
        if (confirmNavigation(state.step, "payment")) {
          navigateToStep("payment")
          showFeedbackMessage("Indo para Payment!", "success")
        }
        return
      } else if ((lowerCommand.includes("envio") || lowerCommand.includes("shipping")) && 
                 !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima") && !lowerCommand.includes("avançar") && !lowerCommand.includes("avancar")) {
        if (confirmNavigation(state.step, "shipping")) {
          navigateToStep("shipping")
          showFeedbackMessage("Indo para Shipping!", "success")
        }
        return
      } else if ((lowerCommand.includes("carrinho") || lowerCommand.includes("cart")) && 
                 !lowerCommand.includes("próxima") && !lowerCommand.includes("proxima") && !lowerCommand.includes("avançar") && !lowerCommand.includes("avancar")) {
        if (confirmNavigation(state.step, "cart")) {
          navigateToStep("cart")
          showFeedbackMessage("Voltando para Cart!", "success")
        }
        return
      }
      
      // Comandos específicos para a página de sucesso
      else if (lowerCommand.includes("novo pedido") || lowerCommand.includes("fazer novo pedido") || lowerCommand.includes("comprar novamente")) {
        router.push("/cart")
        showFeedbackMessage("Indo para novo pedido!", "success")
        return
      } else if (lowerCommand.includes("imprimir") || lowerCommand.includes("comprovante") || lowerCommand.includes("print")) {
        window.print()
        showFeedbackMessage("Imprimindo comprovante!", "success")
        return
      } else if (lowerCommand.includes("voltar ao início") || lowerCommand.includes("voltar ao inicio") || lowerCommand.includes("home")) {
        router.push("/cart")
        showFeedbackMessage("Voltando ao início!", "success")
        return
      }
      
      // Comandos para ir para telas específicas com confirmação
      else if (lowerCommand.includes("tela 1") || lowerCommand.includes("tela um") || lowerCommand.includes("primeira tela")) {
        if (confirmNavigation(state.step, "cart")) {
          navigateToStep("cart")
          showFeedbackMessage("Indo para Cart!", "success")
        }
        return
      } else if (lowerCommand.includes("tela 2") || lowerCommand.includes("tela dois") || lowerCommand.includes("segunda tela")) {
        if (confirmNavigation(state.step, "shipping")) {
          navigateToStep("shipping")
          showFeedbackMessage("Indo para Shipping!", "success")
        }
        return
      } else if (lowerCommand.includes("tela 3") || lowerCommand.includes("tela três") || lowerCommand.includes("terceira tela")) {
        if (confirmNavigation(state.step, "payment")) {
          navigateToStep("payment")
          showFeedbackMessage("Indo para Payment!", "success")
        }
        return
      }
      
      // Comandos específicos para avançar para pagamento (DEVE VIR ANTES dos comandos de correção)
      else if (lowerCommand.includes("avançar para pagamento") || lowerCommand.includes("avancar para pagamento") || 
               lowerCommand.includes("ir para pagamento") || lowerCommand.includes("vai para pagamento") ||
               lowerCommand.includes("avançar") || lowerCommand.includes("avancar") ||
               lowerCommand.includes("próximo") || lowerCommand.includes("proximo") ||
               lowerCommand.includes("seguir")) {
        // Simular clique no botão "Go to payment"
        const goToPaymentButton = document.querySelector('[data-voice-action="go-to-payment"]') as HTMLElement
        if (goToPaymentButton) {
          goToPaymentButton.click()
          showFeedbackMessage("Avançando para pagamento!", "success")
        } else {
          // Fallback: navegar diretamente
          onUpdateState({ step: "payment" })
          showFeedbackMessage("Indo para página de pagamento!", "success")
        }
        return
      }
      
      // Comando para verificar onde está
      else if (lowerCommand.includes("onde estou") || lowerCommand.includes("qual tela") || lowerCommand.includes("em que tela") || lowerCommand.includes("status")) {
        const currentInfo = getCurrentStepInfo()
        showFeedbackMessage(`Você está na página ${currentInfo.name} (${currentInfo.index + 1}/3)`, "info")
        return
      }
      
      // Comandos para sugestão de endereço (tela de checkout) - MAIS ESPECÍFICOS
      else if (lowerCommand.includes("aplicar correção") || lowerCommand.includes("aplicar sugestão") || lowerCommand.includes("corrigir endereço") || 
               lowerCommand.includes("usar sugestão") || lowerCommand.includes("aceitar correção") || lowerCommand.includes("aceitar sugestão")) {
        // Simular clique no botão "Aplicar correção"
        const applyCorrectionButton = document.querySelector('[data-voice-action="apply-correction"]') as HTMLElement
        if (applyCorrectionButton) {
          applyCorrectionButton.click()
          showFeedbackMessage("Correção de endereço aplicada!", "success")
        } else {
          showFeedbackMessage("Botão de correção não encontrado!", "error")
        }
        return
      }
      
      // Comandos para usar endereço do CEP
      else if (lowerCommand.includes("usar endereço") || lowerCommand.includes("usar este endereço") || lowerCommand.includes("aceitar endereço") ||
               lowerCommand.includes("aplicar endereço") || lowerCommand.includes("confirmar endereço")) {
        // Simular clique no botão "Usar este endereço"
        const useAddressButton = document.querySelector('[data-voice-action="use-address"]') as HTMLElement
        if (useAddressButton) {
          useAddressButton.click()
          showFeedbackMessage("Endereço do CEP aplicado!", "success")
        } else {
          showFeedbackMessage("Botão de endereço não encontrado!", "error")
        }
        return
      }
      
      // Comandos para editar endereço
      else if (lowerCommand.includes("editar endereço") || lowerCommand.includes("editar endereco") || lowerCommand.includes("modificar endereço") ||
               lowerCommand.includes("alterar endereço") || lowerCommand.includes("mudar endereço")) {
        // Simular clique no botão "Edit Address"
        const editAddressButton = document.querySelector('[data-voice-action="edit-address"]') as HTMLElement
        if (editAddressButton) {
          editAddressButton.click()
          showFeedbackMessage("Editando endereço!", "success")
        } else {
          showFeedbackMessage("Botão de editar endereço não encontrado!", "error")
        }
        return
      }
      
      // Comandos para informar email
      else if (lowerCommand.includes("email") || lowerCommand.includes("meu email") || lowerCommand.includes("informar email")) {
        // Extrair email do comando - regex mais flexível
        const emailMatch = lowerCommand.match(/(?:email|meu email|informar email)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
        if (emailMatch) {
          const email = emailMatch[1]
          // Atualizar APENAS o email, mantendo outros campos inalterados
          onUpdateState({ 
            userInfo: { 
              ...state.userInfo, 
              email: email 
            } 
          })
          showFeedbackMessage(`Email definido como ${email}!`, "success")
        } else {
          // Tentar extrair qualquer coisa que pareça email após "email"
          const simpleMatch = lowerCommand.match(/(?:email|meu email|informar email)\s+(.+)/)
          if (simpleMatch) {
            const email = simpleMatch[1].trim()
            // Atualizar APENAS o email, mantendo outros campos inalterados
            onUpdateState({ 
              userInfo: { 
                ...state.userInfo, 
                email: email 
              } 
            })
            showFeedbackMessage(`Email definido como ${email}!`, "success")
          } else {
            showFeedbackMessage("Por favor, especifique o email completo! Exemplo: 'email joao@gmail.com'", "error")
          }
        }
        return
      }
      
      // Comandos para informar nome
      else if (lowerCommand.includes("nome") || lowerCommand.includes("meu nome") || lowerCommand.includes("informar nome")) {
        // Extrair nome do comando (tudo após "nome" até o final)
        const nameMatch = lowerCommand.match(/(?:nome|meu nome|informar nome)\s+(.+)/)
        if (nameMatch) {
          const name = nameMatch[1].trim()
          // Atualizar APENAS o nome, mantendo outros campos inalterados
          onUpdateState({ 
            userInfo: { 
              ...state.userInfo, 
              fullName: name 
            } 
          })
          showFeedbackMessage(`Nome definido como ${name}!`, "success")
        } else {
          showFeedbackMessage("Por favor, especifique o nome completo! Exemplo: 'nome João Silva'", "error")
        }
        return
      }
      
      // Comandos para informar telefone
      else if (lowerCommand.includes("telefone") || lowerCommand.includes("celular") || lowerCommand.includes("phone")) {
        // Extrair telefone do comando
        const phoneMatch = lowerCommand.match(/(?:telefone|celular|phone)\s+([0-9()\s-]+)/)
        if (phoneMatch) {
          const phone = phoneMatch[1].trim()
          // Atualizar APENAS o telefone, mantendo outros campos inalterados
          onUpdateState({ 
            userInfo: { 
              ...state.userInfo, 
              phone: phone 
            } 
          })
          showFeedbackMessage(`Telefone definido como ${phone}!`, "success")
        } else {
          showFeedbackMessage("Por favor, especifique o telefone! Exemplo: 'telefone (11) 99999-9999'", "error")
        }
        return
      }
      
      // Comando de ajuda
      else if (lowerCommand.includes("ajuda") || lowerCommand.includes("help")) {
        showFeedbackMessage("Comandos disponíveis: adicionar/remover produtos, mudar quantidade, alterar entrega, ir para pagamento", "info")
        return
      }
      
      // Teste específico para simular problema de conflito
      if (lowerCommand.includes("teste conflito")) {
        // Simular alteração de quantidade do MacBook
        changeQuantity("MacBook Air M2 - 13 inch", 2)
        
        // Aguardar um pouco e verificar se afetou outros produtos
        setTimeout(() => {
          // Simular alteração de quantidade do iPhone
          changeQuantity("iPhone 15 Pro Max - 256GB", 3)
          
          setTimeout(() => {
            showFeedbackMessage("Teste de conflito concluído - verifique console", "info")
          }, 1000)
        }, 1000)
        
        return
      }
      
      // Teste específico para email
      if (lowerCommand.includes("teste email")) {
        onUpdateState({ 
          userInfo: { 
            ...state.userInfo, 
            email: "teste@email.com" 
          } 
        })
        showFeedbackMessage("Teste email executado!", "success")
        return
      }
      
      // Teste específico para nome
      if (lowerCommand.includes("teste nome")) {
        onUpdateState({ 
          userInfo: { 
            ...state.userInfo, 
            fullName: "Teste Nome" 
          } 
        })
        showFeedbackMessage("Teste nome executado!", "success")
        return
      }
      
      // Teste específico para PIX
      if (lowerCommand.includes("teste pix")) {
        const pixButton = document.querySelector('[data-voice-action="payment-pix"]') as HTMLElement
        if (pixButton) {
          pixButton.click()
          showFeedbackMessage("Teste PIX executado!", "success")
        } else {
          onUpdateState({ paymentMethod: "pix" })
          showFeedbackMessage("Teste PIX executado!", "success")
        }
        return
      }
      
      // Comandos para editar informações
      else if (lowerCommand.includes("editar") || lowerCommand.includes("edite")) {
        if (lowerCommand.includes("endereço") || lowerCommand.includes("endereco")) {
          showFeedbackMessage("Funcionalidade de editar endereço em desenvolvimento!", "info")
        } else if (lowerCommand.includes("email")) {
          showFeedbackMessage("Funcionalidade de editar email em desenvolvimento!", "info")
        } else if (lowerCommand.includes("nome")) {
          showFeedbackMessage("Funcionalidade de editar nome em desenvolvimento!", "info")
        }
        return
      }
      
      // Comandos para informar dados
      else if (lowerCommand.includes("informar") || lowerCommand.includes("informe") || lowerCommand.includes("email") || lowerCommand.includes("nome")) {
        if (lowerCommand.includes("email")) {
          // Extrair email do comando (implementação básica)
          const emailMatch = lowerCommand.match(/email\s+([a-zA-Z0-9@.]+)/)
          if (emailMatch) {
            const email = emailMatch[1]
            // Atualizar APENAS o email, mantendo outros campos inalterados
            onUpdateState({ 
              userInfo: { 
                ...state.userInfo, 
                email: email 
              } 
            })
            showFeedbackMessage(`Email definido como ${email}!`, "success")
          } else {
            showFeedbackMessage("Por favor, especifique o email completo!", "error")
          }
        } else if (lowerCommand.includes("nome")) {
          // Extrair nome do comando (implementação básica)
          const nameMatch = lowerCommand.match(/nome\s+(.+)/)
          if (nameMatch) {
            const name = nameMatch[1]
            // Atualizar APENAS o nome, mantendo outros campos inalterados
            onUpdateState({ 
              userInfo: { 
                ...state.userInfo, 
                fullName: name 
              } 
            })
            showFeedbackMessage(`Nome definido como ${name}!`, "success")
          } else {
            showFeedbackMessage("Por favor, especifique o nome completo!", "error")
          }
        }
        return
      }
      
      // Comando de fallback para email (quando o comando principal não funciona)
      else if (lowerCommand.includes("gmail") || lowerCommand.includes("hotmail") || lowerCommand.includes("yahoo") || lowerCommand.includes("@")) {
        // Extrair email que contenha esses domínios ou @
        const emailMatch = lowerCommand.match(/(?:email|meu email|informar email)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
        if (emailMatch) {
          const email = emailMatch[1]
          // Atualizar APENAS o email, mantendo outros campos inalterados
          onUpdateState({ 
            userInfo: { 
              ...state.userInfo, 
              email: email 
            } 
          })
          showFeedbackMessage(`Email definido como ${email}!`, "success")
        } else {
          showFeedbackMessage("Email não reconhecido. Tente: 'email joao@gmail.com'", "error")
        }
        return
      }
      
      // Comandos para chat
      else if (lowerCommand.includes("fechar") || lowerCommand.includes("chat")) {
        if (lowerCommand.includes("chat")) {
          showFeedbackMessage("Chat fechado!", "success")
        }
        return
      }
      
      // Comandos para limpar carrinho
      else if (lowerCommand.includes("limpe") || lowerCommand.includes("limpar") || lowerCommand.includes("esvazie")) {
        onUpdateState({ items: [] })
        showFeedbackMessage("Carrinho limpo!", "success")
        return
      }
      
      // Comandos para entrega expressa
      else if (lowerCommand.includes("expressa") || lowerCommand.includes("express")) {
        onUpdateState({ expressDelivery: true })
        showFeedbackMessage("Entrega expressa ativada!", "success")
        return
      }
      
      // Comandos para fechar cards e elementos
      else if (lowerCommand.includes("fechar recomendações") || lowerCommand.includes("fechar recomendacoes") || 
               lowerCommand.includes("ocultar recomendações") || lowerCommand.includes("ocultar recomendacoes") ||
               lowerCommand.includes("remover recomendações") || lowerCommand.includes("remover recomendacoes") ||
               lowerCommand.includes("esconder recomendações") || lowerCommand.includes("esconder recomendacoes")) {
        // Simular clique no botão de fechar recomendações
        const closeRecommendationsButton = document.querySelector('[data-voice-action="close-recommendations"]') as HTMLElement
        if (closeRecommendationsButton) {
          closeRecommendationsButton.click()
          showFeedbackMessage("Recomendações fechadas!", "success")
        } else {
          showFeedbackMessage("Card de recomendações não encontrado!", "error")
        }
        return
      }
      
      // Comandos para acessibilidade
      else if (lowerCommand.includes("alto contraste") || lowerCommand.includes("contraste alto") || 
               lowerCommand.includes("modo escuro") || lowerCommand.includes("contraste")) {
        // Simular clique no botão de contraste
        const contrastButton = document.querySelector('button[title="Alternar contraste alto"]') as HTMLElement
        if (contrastButton) {
          contrastButton.click()
          showFeedbackMessage("Contraste alto ativado!", "success")
        } else {
          showFeedbackMessage("Botão de contraste não encontrado!", "error")
        }
        return
      } else if (lowerCommand.includes("aumentar fonte") || lowerCommand.includes("fonte maior") || 
                 lowerCommand.includes("texto maior") || lowerCommand.includes("aumentar texto")) {
        // Simular clique no botão de aumentar fonte
        const increaseButton = document.querySelector('button[title="Aumentar tamanho da fonte"]') as HTMLElement
        if (increaseButton) {
          increaseButton.click()
          showFeedbackMessage("Fonte aumentada!", "success")
        } else {
          showFeedbackMessage("Botão de fonte não encontrado!", "error")
        }
        return
      } else if (lowerCommand.includes("diminuir fonte") || lowerCommand.includes("fonte menor") || 
                 lowerCommand.includes("texto menor") || lowerCommand.includes("diminuir texto")) {
        // Simular clique no botão de diminuir fonte
        const decreaseButton = document.querySelector('button[title="Diminuir tamanho da fonte"]') as HTMLElement
        if (decreaseButton) {
          decreaseButton.click()
          showFeedbackMessage("Fonte diminuída!", "success")
        } else {
          showFeedbackMessage("Botão de fonte não encontrado!", "error")
        }
        return
      } else if (lowerCommand.includes("reset acessibilidade") || lowerCommand.includes("resetar acessibilidade") || 
                 lowerCommand.includes("resetar configurações") || lowerCommand.includes("voltar ao normal")) {
        // Simular clique no botão de reset
        const resetButton = document.querySelector('button[title="Resetar configurações de acessibilidade"]') as HTMLElement
        if (resetButton) {
          resetButton.click()
          showFeedbackMessage("Configurações resetadas!", "success")
        } else {
          showFeedbackMessage("Botão de reset não encontrado!", "error")
        }
        return
      }
      
      else {
        showFeedbackMessage("Comando não reconhecido. Diga 'ajuda' para ver comandos disponíveis", "error")
      }
      
      trackAction("voice_command_executed", { command: lowerCommand })
      
    } catch (error) {
      console.error("❌ Erro ao processar comando de voz:", error)
      showFeedbackMessage("Erro ao processar comando", "error")
    } finally {
      // Aguardar um pouco antes de permitir novo processamento
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  const addProduct = (productName: string) => {
    const existingItem = state.items.find(item => item.name === productName)
    
    if (existingItem) {
      const newItems = state.items.map(item =>
        item.name === productName
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item }
      )
      
      setTimeout(() => {
        onUpdateState({ items: newItems })
      }, 0)
    } else {
      // Adicionar novo produto
      const newItem = {
        id: `voice-${Date.now()}`,
        name: productName,
        price: 999.99,
        originalPrice: 1299.99,
        quantity: 1,
        image: "",
        category: "Electronics",
        deliveryType: "shipping" as const
      }
      
      const newItems = [...state.items, newItem]
      
      setTimeout(() => {
        onUpdateState({ items: newItems })
      }, 0)
    }
  }

  const removeProduct = (productName: string) => {
    const newItems = state.items.filter(item => item.name !== productName)
    
    setTimeout(() => {
      onUpdateState({ items: newItems })
    }, 0)
  }

  const changeQuantity = (productName: string, quantity: number) => {
    // Verificar se o produto existe no carrinho
    const existingItem = state.items.find(item => item.name === productName)
    
    if (!existingItem) {
      showFeedbackMessage(`Produto ${productName} não encontrado no carrinho!`, "error")
      return
    }
    
    // Verificar se a quantidade já é a mesma
    if (existingItem.quantity === quantity) {
      showFeedbackMessage(`Quantidade já é ${quantity}!`, "info")
      return
    }
    
    // Criar uma cópia imutável do array de itens
    const newItems = state.items.map(item => {
      if (item.name === productName) {
        const newQuantity = Math.max(1, Math.min(5, quantity))
        return { ...item, quantity: newQuantity }
      } else {
        return { ...item }
      }
    })
    
    // Usar setTimeout para garantir que a atualização seja assíncrona e não conflite
    setTimeout(() => {
      onUpdateState({ items: newItems })
    }, 0)
  }

  return (
    <>
      {/* Botão de Comando por Voz - Movido para posição diferente */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          onClick={isAlwaysListening ? stopListening : startListening}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isAlwaysListening 
              ? "bg-pink-500 hover:bg-pink-600 ring-2 ring-pink-300" 
              : "bg-[#eb015b] hover:bg-[#c1014a]"
          }`}
          disabled={isProcessing}
          title={isAlwaysListening ? "Comandos de voz ativos - Clique para desativar" : "Comandos de voz inativos - Clique para ativar"}
        >
          {isAlwaysListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>
        
        {/* Indicador de escuta contínua */}
        {isAlwaysListening && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 rounded-full animate-ping" />
        )}
        
        {/* Indicador de status */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isProcessing 
              ? "bg-yellow-100 text-yellow-800" 
              : isAlwaysListening 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-600"
          }`}>
            {isProcessing ? "Processando..." : isAlwaysListening ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      {/* Feedback de Comando */}
      {showFeedback && (
        <div className="fixed top-4 right-4 z-50">
          <Card className={`${
            feedbackType === "success" ? "border-green-200 bg-green-50" :
            feedbackType === "error" ? "border-red-200 bg-red-50" :
            "border-blue-200 bg-blue-50"
          }`}>
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Volume2 className={`w-4 h-4 ${
                  feedbackType === "success" ? "text-green-600" :
                  feedbackType === "error" ? "text-red-600" :
                  "text-blue-600"
                }`} />
                <span className={`text-sm font-medium ${
                  feedbackType === "success" ? "text-green-900" :
                  feedbackType === "error" ? "text-red-900" :
                  "text-blue-900"
                }`}>
                  {feedbackMessage}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedback(false)}
                  className="p-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Indicador de Processamento */}
      {isProcessing && (
        <div className="fixed top-4 left-4 z-50">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-blue-900">
                  Processando comando...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
} 