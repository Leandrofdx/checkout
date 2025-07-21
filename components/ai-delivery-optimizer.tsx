"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Clock, Zap, X } from 'lucide-react'

interface AIDeliveryOptimizerProps {
  currentDelivery: string
  suggestions: {
    delivery?: string
  }
  onDeliveryChange: (delivery: string) => void
  onClose: () => void // NEW: Close prop
}

export function AIDeliveryOptimizer({ currentDelivery, suggestions, onDeliveryChange, onClose }: AIDeliveryOptimizerProps) {
  const getDeliveryAdvice = () => {
    const options = [
      {
        type: "express",
        icon: Zap,
        title: "Entrega Expressa",
        description: "Chegará amanhã",
        benefit: "Baseado no seu histórico, você prefere rapidez",
        price: "+R$ 5,00",
        color: "blue",
        cardClass: "border-blue-200 bg-blue-50",
        iconClass: "bg-blue-100 text-blue-600",
        titleClass: "text-blue-900",
        benefitClass: "text-blue-700",
        descClass: "text-blue-600",
        priceClass: "text-blue-700",
        buttonClass: "bg-blue-600 hover:bg-blue-700 text-white"
      },
      {
        type: "pickup",
        icon: Package,
        title: "Retirada na Loja",
        description: "Disponível hoje",
        benefit: "Loja 2x mais próxima encontrada",
        price: "Grátis",
        color: "green",
        cardClass: "border-green-200 bg-green-50",
        iconClass: "bg-green-100 text-green-600",
        titleClass: "text-green-900",
        benefitClass: "text-green-700",
        descClass: "text-green-600",
        priceClass: "text-green-700",
        buttonClass: "bg-green-600 hover:bg-green-700 text-white"
      },
      {
        type: "scheduled",
        icon: Clock,
        title: "Entrega Agendada",
        description: "Escolha o melhor horário",
        benefit: "Economiza R$ 3,00",
        price: "-R$ 3,00",
        color: "purple",
        cardClass: "border-purple-200 bg-purple-50",
        iconClass: "bg-purple-100 text-purple-600",
        titleClass: "text-purple-900",
        benefitClass: "text-purple-700",
        descClass: "text-purple-600",
        priceClass: "text-purple-700",
        buttonClass: "bg-purple-600 hover:bg-purple-700 text-white"
      },
    ]

    // AI recommendation logic
    if (suggestions.delivery) {
      return options.find((o) => o.type === suggestions.delivery) || options[0]
    }

    return options[0]
  }

  const recommendation = getDeliveryAdvice()
  const Icon = recommendation.icon

  // Only show if there's a recommendation and it's not the current method
  if (!recommendation || currentDelivery === recommendation.type) return null

  return (
    <Card className={`${recommendation.cardClass} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 ${recommendation.iconClass} rounded-lg flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className={`text-sm font-medium ${recommendation.titleClass}`}>{recommendation.title}</span>
              </div>
              <span className={`text-sm font-bold ${recommendation.priceClass}`}>{recommendation.price}</span>
            </div>
            <p className={`text-sm ${recommendation.benefitClass} mt-1`}>{recommendation.benefit}</p>
            <p className={`text-xs ${recommendation.descClass}`}>{recommendation.description}</p>
          </div>
          <Button
            onClick={() => onDeliveryChange(recommendation.type)}
            size="sm"
            className={`${recommendation.buttonClass} flex-shrink-0`}
          >
            Escolher
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-600 hover:bg-gray-100 p-1 h-auto flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
