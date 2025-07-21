"use client"

import { ChevronRight, ShoppingBag, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { AccessibilityControls } from "./accessibility-controls"

interface HeaderProps {
  currentStep: string
  onStepClick: (step: string) => void
}

export function Header({ currentStep, onStepClick }: HeaderProps) {
  const router = useRouter()
  
  const getStepName = (step: string) => {
    switch (step) {
      case "cart":
        return "Cart"
      case "shipping":
        return "Shipping"
      case "pickup":
        return "Shipping"
      case "payment":
        return "Payment"
      default:
        return "Cart"
    }
  }

  const steps = [
    { name: "Cart", key: "cart" },
    { name: "Shipping", key: "shipping" },
    { name: "Payment", key: "payment" },
  ]
  const currentStepName = getStepName(currentStep)

  const canNavigateToStep = (stepKey: string) => {
    const stepOrder = ["cart", "shipping", "payment"]
    const currentIndex = stepOrder.indexOf(currentStep)
    const targetIndex = stepOrder.indexOf(stepKey)
    return targetIndex <= currentIndex
  }

  const handleStepClick = (stepKey: string) => {
    if (canNavigateToStep(stepKey)) {
      router.push(`/${stepKey}`)
      onStepClick(stepKey)
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStepClick("cart")}
            >
              {/* Logo melhorada */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#eb015b] via-[#c1014a] to-[#a00139] rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Zap className="w-2 h-2 text-yellow-800" />
                  </div>
                </div>
              </div>
              
              {/* Nome da marca melhorado */}
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-xl tracking-tight">ShopEase</span>
                <span className="text-gray-500 text-xs font-medium">Powered Checkout</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Controles de Acessibilidade */}
              <AccessibilityControls />
              
              {/* Navegação */}
              <nav className="flex items-center space-x-2 text-sm">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStepClick(step.key)}
                      className={`${
                        step.name === currentStepName
                          ? "text-gray-900 font-semibold"
                          : canNavigateToStep(step.key)
                            ? "text-[#eb015b] hover:text-[#c1014a] cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                      } transition-colors px-2 py-1 rounded-md hover:bg-gray-50`}
                      disabled={!canNavigateToStep(step.key)}
                    >
                      {step.name}
                    </button>
                    {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
