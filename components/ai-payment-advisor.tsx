"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, Zap, Gift } from "lucide-react"

interface AIPaymentAdvisorProps {
  currentMethod: string
  suggestions: {
    payment?: string
  }
  onMethodChange: (method: string) => void
}

export function AIPaymentAdvisor({ currentMethod, suggestions, onMethodChange }: AIPaymentAdvisorProps) {
  const getPaymentAdvice = () => {
    const advice = [
      {
        method: "pix",
        icon: DollarSign,
        title: "PIX Recomendado",
        description: "Aprovação instantânea e sem taxas",
        benefit: "Mais rápido para sua compra",
        color: "green",
        cardClass: "border-green-200 bg-green-50",
        iconClass: "bg-green-100 text-green-600",
        titleClass: "text-green-900",
        benefitClass: "text-green-700",
        descClass: "text-green-600",
        buttonClass: "bg-green-600 hover:bg-green-700 text-white"
      },
      {
        method: "credit",
        icon: CreditCard,
        title: "Cartão de Crédito",
        description: "Parcelamento disponível",
        benefit: "Cashback de 2% disponível",
        color: "blue",
        cardClass: "border-blue-200 bg-blue-50",
        iconClass: "bg-blue-100 text-blue-600",
        titleClass: "text-blue-900",
        benefitClass: "text-blue-700",
        descClass: "text-blue-600",
        buttonClass: "bg-blue-600 hover:bg-blue-700 text-white"
      },
      {
        method: "boleto",
        icon: Gift,
        title: "Boleto Bancário",
        description: "Desconto especial",
        benefit: "3% de desconto no boleto",
        color: "purple",
        cardClass: "border-purple-200 bg-purple-50",
        iconClass: "bg-purple-100 text-purple-600",
        titleClass: "text-purple-900",
        benefitClass: "text-purple-700",
        descClass: "text-purple-600",
        buttonClass: "bg-purple-600 hover:bg-purple-700 text-white"
      },
    ]

    // AI logic para recomendar baseado no perfil
    if (suggestions.payment) {
      return advice.find((a) => a.method === suggestions.payment) || advice[0]
    }

    // Default recommendation
    return advice[0]
  }

  const recommendation = getPaymentAdvice()
  const Icon = recommendation.icon

  if (currentMethod === recommendation.method) return null

  return (
    <Card className={`${recommendation.cardClass} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${recommendation.iconClass} rounded-lg`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className={`text-sm font-medium ${recommendation.titleClass}`}>{recommendation.title}</span>
            </div>
            <p className={`text-sm ${recommendation.benefitClass} mt-1`}>{recommendation.benefit}</p>
            <p className={`text-xs ${recommendation.descClass}`}>{recommendation.description}</p>
          </div>
          <Button
            onClick={() => onMethodChange(recommendation.method)}
            size="sm"
            className={recommendation.buttonClass}
          >
            Usar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
