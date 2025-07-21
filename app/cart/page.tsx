"use client"

import { useState } from "react"
import { CartPage } from "../../components/cart-page"
import { VoiceCommander } from "../../components/voice-commander"
import { VoiceHelp } from "../../components/voice-help"
import { Header } from "../../components/header"
import type { CheckoutState } from "../../types/checkout"

export default function Cart() {
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
    expressDelivery: false,
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

  const trackAction = (action: string, data?: any) => {
    console.log("Voice Action:", action, data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep="cart" onStepClick={handleStepNavigation} />
      <CartPage state={state} onUpdateState={updateState} />
      <VoiceCommander state={state} onUpdateState={updateState} trackAction={trackAction} />
      <VoiceHelp />
    </div>
  )
} 