"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VoiceCommander } from "../../components/voice-commander"
import { VoiceHelp } from "../../components/voice-help"
import { Header } from "../../components/header"
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CheckoutState } from "../../types/checkout"

export default function Success() {
  const router = useRouter()
  const [state, setState] = useState<CheckoutState>({
    step: "success",
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
    orderNumber: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
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

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep="success" onStepClick={handleStepNavigation} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Confirmação de Sucesso */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-4">
            Seu pedido foi processado com sucesso. Obrigado por escolher a ShopEase!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-medium">
              Número do Pedido: <span className="font-bold">{state.orderNumber}</span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Resumo do Pedido</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Informações de Entrega</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Endereço de Entrega</p>
                  <p className="text-gray-600">
                    {state.shippingAddress.street}<br />
                    {state.shippingAddress.city}, {state.shippingAddress.state} {state.shippingAddress.postalCode}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Método de Pagamento</p>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-gray-600 capitalize">{state.paymentMethod}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Modo de Entrega</p>
                  <span className="text-gray-600 capitalize">{state.deliveryMode}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="mt-8 text-center space-x-4">
          <Button 
            onClick={() => router.push('/cart')}
            className="bg-[#eb015b] hover:bg-[#c1014a]"
          >
            Fazer Novo Pedido
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.print()}
          >
            Imprimir Comprovante
          </Button>
        </div>
      </div>

      <VoiceCommander state={state} onUpdateState={updateState} trackAction={trackAction} />
      <VoiceHelp />
    </div>
  )
} 