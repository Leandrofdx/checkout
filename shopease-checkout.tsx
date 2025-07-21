"use client"

import { useState } from "react"
import { Header } from "./components/header"
import { CartPage } from "./components/cart-page"
import { ShippingPage } from "./components/shipping-page"
import { PickupPage } from "./components/pickup-page"
import { PaymentPage } from "./components/payment-page"
import { SuccessPage } from "./components/success-page"
import { VoiceCommander } from "./components/voice-commander"
import { VoiceHelp } from "./components/voice-help"
import type { CheckoutState } from "./types/checkout"

export default function ShopEaseCheckout() {
  const [state, setState] = useState<CheckoutState>({
    step: "cart",
    deliveryMode: "shipping",
    items: [
      {
        id: "1",
        name: "iPhone 15 Pro Max - 256GB",
        price: 1199.99,
        originalPrice: 1299.99,
        quantity: 1,
        image: "/images/iphone-15-pro.jpg",
        category: "Electronics",
        deliveryType: "shipping",
      },
      {
        id: "2",
        name: "MacBook Air M2 - 13 inch",
        price: 1099.99,
        originalPrice: 1199.99,
        quantity: 1,
        image: "/images/macbook-air.jpg",
        category: "Electronics",
        deliveryType: "shipping",
      },
      {
        id: "3",
        name: "AirPods Pro 2nd Generation",
        price: 249.99,
        originalPrice: 299.99,
        quantity: 1,
        image: "/images/airpods-pro.jpg",
        category: "Electronics",
        deliveryType: "shipping",
      },
      {
        id: "4",
        name: "Apple Watch Series 9 - 45mm",
        price: 399.99,
        originalPrice: 449.99,
        quantity: 1,
        image: "/images/apple-watch.jpg",
        category: "Electronics",
        deliveryType: "pickup",
      },
    ],
    userInfo: {
      email: "user@mail.com.br",
      fullName: "Full Name User",
      phone: "(201) 545-4411",
    },
    shippingAddress: {
      street: "1535 Broadway",
      city: "New York",
      state: "NY",
      postalCode: "10036",
      recipient: "teste",
    },
    pickupStore: "",
    pickupDate: "",
    giftCardEnabled: true,
    giftCardCode: "",
    paymentMethod: "pix",
    orderNumber: "",
    promoCode: {
      code: "",
      discount: 0,
      isValid: false,
    },
    expressDelivery: false, // NEW: Entrega expressa
  })

  const updateState = (updates: Partial<CheckoutState>) => {
    console.log("🔄 updateState chamado com:", updates)
    setState((prev) => {
      const newState = { ...prev, ...updates }
      console.log("🔄 Novo estado:", newState)
      return newState
    })
  }

  const handleStepNavigation = (step: string) => {
    updateState({ step: step as CheckoutState["step"] })
  }

  // Função para tracking de ações
  const trackAction = (action: string, data?: any) => {
    console.log("Voice Action:", action, data)
    // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
  }

  const renderCurrentStep = () => {
    switch (state.step) {
      case "cart":
        return <CartPage state={state} onUpdateState={updateState} />
      case "shipping":
        return <ShippingPage state={state} onUpdateState={updateState} />
      case "pickup":
        return <PickupPage state={state} onUpdateState={updateState} />
      case "payment":
        return <PaymentPage state={state} onUpdateState={updateState} />
      case "success":
        return <SuccessPage state={state} />
      default:
        return <CartPage state={state} onUpdateState={updateState} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {state.step !== "success" && <Header currentStep={state.step} onStepClick={handleStepNavigation} />}
      {renderCurrentStep()}
      
      {/* Componentes de Voz */}
      {state.step !== "success" && (
        <>
          <VoiceCommander 
            state={state} 
            onUpdateState={updateState} 
            trackAction={trackAction}
          />
          <VoiceHelp />
        </>
      )}
    </div>
  )
}
