"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle, Eye, EyeOff, X } from 'lucide-react'
import { useState } from "react"

interface AIFraudDetectorProps {
  fraudScore: number
  behaviorFlags: string[]
}

export function AIFraudDetector({ fraudScore, behaviorFlags }: AIFraudDetectorProps) {
  const [isClosed, setIsClosed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const getRiskLevel = () => {
    if (fraudScore < 30) return { 
      level: "low", 
      color: "green", 
      icon: CheckCircle,
      cardClass: "border-green-200 bg-green-50",
      iconClass: "text-green-600",
      titleClass: "text-green-900",
      textClass: "text-green-700"
    }
    if (fraudScore < 70) return { 
      level: "medium", 
      color: "yellow", 
      icon: Shield,
      cardClass: "border-yellow-200 bg-yellow-50",
      iconClass: "text-yellow-600",
      titleClass: "text-yellow-900",
      textClass: "text-yellow-700"
    }
    return { 
      level: "high", 
      color: "red", 
      icon: AlertTriangle,
      cardClass: "border-red-200 bg-red-50",
      iconClass: "text-red-600",
      titleClass: "text-red-900",
      textClass: "text-red-700"
    }
  }

  const risk = getRiskLevel()
  const Icon = risk.icon

  // Só mostra se tem score > 0 OU se tem flags de fraude reais e não foi fechado
  if ((fraudScore === 0 && behaviorFlags.length === 0) || isClosed) return null

  return (
    <Card className={`${risk.cardClass} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 ${risk.iconClass} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${risk.titleClass}`}>
                Análise de Segurança {fraudScore > 0 && `(Score: ${fraudScore}/100)`}
              </span>
              <div className="flex items-center space-x-1">
                {behaviorFlags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-xs p-1 h-auto">
                    {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsClosed(true)} className="text-xs p-1 h-auto">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {fraudScore > 70 && (
              <p className="text-sm text-red-700 mt-1">
                ⚠️ Comportamento suspeito detectado. Nossa equipe pode entrar em contato.
              </p>
            )}

            {fraudScore > 30 && fraudScore <= 70 && (
              <p className="text-sm text-yellow-700 mt-1">⚡ Verificação adicional pode ser necessária.</p>
            )}

            {fraudScore <= 30 && behaviorFlags.length === 0 && <p className="text-sm text-green-700 mt-1">✅ Transação segura verificada.</p>}
            {fraudScore <= 30 && behaviorFlags.length > 0 && <p className="text-sm text-yellow-700 mt-1">⚠️ Atenção: Algumas flags de comportamento foram detectadas.</p>}


            {/* APENAS MOSTRA FLAGS SE REALMENTE TEM PROBLEMAS DE FRAUDE */}
            {showDetails && behaviorFlags.length > 0 && (
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-xs font-medium text-gray-700 mb-1">Flags de segurança:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {behaviorFlags.map((flag, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
