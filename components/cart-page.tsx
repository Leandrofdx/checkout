"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Search, Truck, Package, Trash2 } from 'lucide-react'
import { AddressDrawer } from "./drawer"
import { ProductIcon } from "./product-icons"
import { AppleProductIcon } from "./apple-product-icon"
import { PromoCodeDrawer } from "./promo-code-drawer"
import { AIChatAssistant } from "./ai-chat-assistant"
import { AIFraudDetector } from "./ai-fraud-detector"
import { AIDeliveryOptimizer } from "./ai-delivery-optimizer"
import { AIProductRecommendations } from "./ai-product-recommendations"
import { useAICheckout } from "../hooks/use-ai-checkout"
import type { CheckoutState } from "../types/checkout"

interface CartPageProps {
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function CartPage({ state, onUpdateState }: CartPageProps) {
  const router = useRouter()
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showAddressDrawer, setShowAddressDrawer] = useState(false)
  const [showPromoDrawer, setShowPromoDrawer] = useState(false)
  const [searchQuery, setSearchQuery] = useState("Manhattan, NY, USA")

  // Local states for card visibility
  const [showDeliverySuggestionCard, setShowDeliverySuggestionCard] = useState(false)
  const [showProductRecommendationsCard, setShowProductRecommendationsCard] = useState(false)
  const [recommendationsClosed, setRecommendationsClosed] = useState(false)

  const {
    analysis,
    chatMessages,
    showChat,
    setShowChat,
    sendChatMessage,
    recommendations,
    trackAction,
  } = useAICheckout(state)

  const addressSuggestions = [
    "Manhattan, New York, NY, USA",
    "Hilton Garden Inn New York/Manhattan-Chelsea, West 28th Street, New York, NY, USA",
    "USA Shaolin Temple, Allen Street, Manhattan, NY, USA",
    "The Luxury Collection Hotel Manhattan Midtown, West 54th Street, New York, NY, USA",
    "Hotel Riu Plaza Manhattan Times Square, West 47th Street, New York, NY, USA",
  ]

  // Effect for Delivery Optimizer visibility
  useEffect(() => {
    console.log("🔍 Debug - Analysis suggestions:", analysis?.suggestions)
    console.log("🔍 Debug - Delivery suggestion:", analysis?.suggestions?.delivery)
    if (analysis?.suggestions?.delivery) {
      console.log("✅ Mostrando card de entrega")
      setShowDeliverySuggestionCard(true)
    }
  }, [analysis?.suggestions?.delivery])

  // Effect for Product Recommendations visibility (5s after delivery suggestion)
  useEffect(() => {
    console.log("🔍 Debug - Recommendations:", recommendations)
    console.log("🔍 Debug - Show delivery card:", showDeliverySuggestionCard)
    console.log("🔍 Debug - Recommendations closed:", recommendationsClosed)
    if (showDeliverySuggestionCard && recommendations.length > 0 && !recommendationsClosed) {
      console.log("✅ Mostrando card de recomendações")
      const timer = setTimeout(() => {
        setShowProductRecommendationsCard(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showDeliverySuggestionCard, recommendations, recommendationsClosed])

  const handleDeliveryModeChange = (mode: "shipping" | "pickup") => {
    console.log("🚚 ===== HANDLEDELIVERYMODECHANGE =====")
    console.log("🚚 Modo solicitado:", mode)
    console.log("🚚 Estado atual antes da alteração:", state.items.map(item => `${item.name} (deliveryType: ${item.deliveryType})`))
    
    trackAction("delivery_mode_change", mode)

    // Produtos que devem sempre ser pickup (independente do modo selecionado)
    const pickupOnlyProducts = ["Apple Watch Series 9 - 45mm"]
    
    // Produtos que devem sempre ser shipping (independente do modo selecionado)
    const shippingOnlyProducts = ["iPhone 15 Pro Max - 256GB", "MacBook Air M2 - 13 inch", "AirPods Pro 2nd Generation"]

    if (mode === "pickup") {
      console.log("🚚 Modo Pickup: TODOS os produtos vão para pickup")
      const newItems = state.items.map((item) => ({
        ...item,
        deliveryType: "pickup" as const
      }))
      console.log("🚚 Novos itens após alteração:", newItems.map(item => `${item.name} (deliveryType: ${item.deliveryType})`))
      
      onUpdateState({
        deliveryMode: "pickup",
        items: newItems,
      })
    } else {
      console.log("🚚 Modo Shipping: Preservando tipo de entrega específico")
      const newItems = state.items.map((item) => ({
        ...item,
        deliveryType: pickupOnlyProducts.includes(item.name) 
          ? "pickup" as const
          : "shipping" as const
      }))
      console.log("🚚 Novos itens após alteração:", newItems.map(item => `${item.name} (deliveryType: ${item.deliveryType})`))
      
      onUpdateState({
        deliveryMode: "shipping",
        items: newItems,
      })
    }
    
    console.log("🚚 ===== HANDLEDELIVERYMODECHANGE FINALIZADO =====")
  }

  const handleExpressDelivery = () => {
    trackAction("express_delivery_selected")
    onUpdateState({
      expressDelivery: true
    })
    // Fechar o card de sugestão
    setShowDeliverySuggestionCard(false)
  }

  const handleQtyChange = (id: string, qty: number) => {
    console.log("🛒 ===== HANDLEQTYCHANGE =====")
    console.log("🛒 ID solicitado:", id)
    console.log("🛒 Quantidade solicitada:", qty)
    console.log("🛒 Estado atual antes da alteração:", state.items.map(item => `${item.name} (id: ${item.id}, qty: ${item.quantity})`))
    
    trackAction("quantity_change", { id, qty })
    
    const newItems = state.items.map((item) => {
      if (item.id === id) {
        console.log("🛒 ✅ Alterando quantidade de", item.name, "de", item.quantity, "para", qty)
        return { ...item, quantity: qty }
      } else {
        console.log("🛒 Mantendo quantidade de", item.name, "como", item.quantity)
        return item
      }
    })
    
    console.log("🛒 Novos itens após alteração:", newItems.map(item => `${item.name} (id: ${item.id}, qty: ${item.quantity})`))
    console.log("🛒 Chamando onUpdateState com:", { items: newItems })
    
    onUpdateState({
      items: newItems,
    })
    
    console.log("🛒 ===== HANDLEQTYCHANGE FINALIZADO =====")
  }

  const handleRemoveItem = (id: string) => {
    console.log("🗑️ ===== HANDLEREMOVEITEM =====")
    console.log("🗑️ ID solicitado para remoção:", id)
    console.log("🗑️ Estado atual antes da remoção:", state.items.map(item => `${item.name} (id: ${item.id})`))
    
    trackAction("remove_item", id)
    
    const newItems = state.items.filter((item) => item.id !== id)
    console.log("🗑️ Novos itens após remoção:", newItems.map(item => `${item.name} (id: ${item.id})`))
    console.log("🗑️ Chamando onUpdateState com:", { items: newItems })
    
    onUpdateState({
      items: newItems,
    })
    
    console.log("🗑️ ===== HANDLEREMOVEITEM FINALIZADO =====")
  }

  const handleAddressSelect = (address: string) => {
    trackAction("address_select", address)
    onUpdateState({
      shippingAddress: {
        ...state.shippingAddress,
        street: address.includes("USA Shaolin Temple") ? "USA Shaolin Temple, Allen Street" : "1535 Broadway",
        city: "New York",
        state: "NY",
        postalCode: "10036",
        recipient: "teste",
      },
    })
    setShowAddressModal(false)
  }

  const handleAddRecommendedProduct = (productName: string) => {
    trackAction("add_recommended_product", productName)
    // Add product logic here
    console.log("Adding recommended product:", productName)
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = state.expressDelivery ? 7.0 : 2.0 // Entrega expressa: R$ 7,00, Normal: R$ 2,00
  const promoDiscount = state.promoCode.isValid ? subtotal * state.promoCode.discount : 0
  const discount = -60.0 - promoDiscount
  const total = subtotal + delivery + discount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-xl font-medium text-gray-900">Cart</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-sm text-gray-600">{state.items.length} items - ${subtotal.toFixed(2)}</span>
                <Button
                  variant="link"
                  className="text-[#eb015b] p-0 text-sm font-medium self-start sm:self-auto"
                  onClick={() => trackAction("clear_cart")}
                >
                  Clear all
                </Button>
              </div>
            </div>

            {/* AI Fraud Detection - APARECE EM TEMPO REAL */}
            {analysis && (analysis.fraudScore > 0 || analysis.behaviorFlags.length > 0) && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AIFraudDetector
                  fraudScore={analysis.fraudScore}
                  behaviorFlags={analysis.behaviorFlags}
                />
              </div>
            )}

            {/* AI Delivery Optimizer - SÓ NA TELA DE CART E COM OPÇÃO DE FECHAR */}
            {(() => {
              console.log("🔍 Debug - Renderizando card de entrega:", {
                hasDeliverySuggestion: !!analysis?.suggestions?.delivery,
                showDeliveryCard: showDeliverySuggestionCard,
                deliverySuggestion: analysis?.suggestions?.delivery
              })
              return analysis?.suggestions?.delivery && showDeliverySuggestionCard && !state.expressDelivery
            })() && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AIDeliveryOptimizer
                  currentDelivery={state.deliveryMode}
                  suggestions={analysis?.suggestions || {}}
                  onDeliveryChange={(delivery) => {
                    if (delivery === "express") {
                      handleExpressDelivery()
                    } else {
                      trackAction("ai_delivery_suggestion", delivery)
                      handleDeliveryModeChange(delivery as "shipping" | "pickup")
                    }
                  }}
                  onClose={() => setShowDeliverySuggestionCard(false)}
                />
              </div>
            )}

            {/* AI Product Recommendations - SÓ NA TELA DE CART E COM OPÇÃO DE FECHAR */}
            {(() => {
              console.log("🔍 Debug - Renderizando recomendações:", {
                recommendationsLength: recommendations.length,
                showProductCard: showProductRecommendationsCard,
                recommendationsClosed: recommendationsClosed
              })
              return recommendations.length > 0 && showProductRecommendationsCard
            })() && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AIProductRecommendations
                  recommendations={recommendations}
                  onAddProduct={handleAddRecommendedProduct}
                  onClose={() => {
                    setShowProductRecommendationsCard(false)
                    setRecommendationsClosed(true)
                  }}
                />
              </div>
            )}

            {/* Delivery Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Card
                className={`cursor-pointer transition-all border ${
                  state.deliveryMode === "shipping"
                    ? "border-[#eb015b] bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleDeliveryModeChange("shipping")}
                data-delivery-mode="shipping"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded ${state.deliveryMode === "shipping" ? "bg-[#eb015b]" : "bg-gray-100"}`}
                    >
                      <Truck
                        className={`w-4 h-4 ${state.deliveryMode === "shipping" ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Shipping</div>
                      <div className="text-xs text-gray-500">Earliest delivery on Mon, Jul 28</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all border ${
                  state.deliveryMode === "pickup" || state.deliveryMode === "mixed"
                    ? "border-[#eb015b] bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleDeliveryModeChange("pickup")}
                data-delivery-mode="pickup"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded ${state.deliveryMode === "pickup" || state.deliveryMode === "mixed" ? "bg-[#eb015b]" : "bg-gray-100"}`}
                    >
                      <Package
                        className={`w-4 h-4 ${state.deliveryMode === "pickup" || state.deliveryMode === "mixed" ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Pickup</div>
                      <div className="text-xs text-gray-500">Earliest pickup on Wed, Jul 23</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Items */}
            <div className="space-y-6">
              {/* Shipping Items */}
              {state.items.some((item) => item.deliveryType === "shipping") && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping</h2>
                  {state.items
                    .filter((item) => item.deliveryType === "shipping")
                    .map((item) => (
                      <Card key={item.id} className="mb-3 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.name.toLowerCase().includes("iphone") || 
                                 item.name.toLowerCase().includes("macbook") || 
                                 item.name.toLowerCase().includes("airpods") || 
                                 item.name.toLowerCase().includes("apple watch") ? (
                                  <AppleProductIcon productName={item.name} className="w-8 h-8" />
                                ) : (
                                  <ProductIcon productName={item.name} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  Sold and shipped by {item.category}
                                  <div className="w-3 h-3 bg-gray-300 rounded-full ml-2"></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                              <select
                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                value={item.quantity}
                                onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                              <Trash2
                                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => handleRemoveItem(item.id)}
                              />
                              <div className="text-right">
                                <div className="text-xs text-gray-400 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </div>
                                <div className="font-semibold text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#eb015b] border-[#eb015b] bg-transparent hover:bg-pink-50 text-xs px-3 py-1"
                                onClick={() => trackAction("test_button", item.id)}
                              >
                                Test :)
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}

              {/* Pickup Items */}
              {state.items.some((item) => item.deliveryType === "pickup") && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Pickup</h2>
                  {state.items
                    .filter((item) => item.deliveryType === "pickup")
                    .map((item) => (
                      <Card key={item.id} className="mb-3 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.name.toLowerCase().includes("iphone") || 
                                 item.name.toLowerCase().includes("macbook") || 
                                 item.name.toLowerCase().includes("airpods") || 
                                 item.name.toLowerCase().includes("apple watch") ? (
                                  <AppleProductIcon productName={item.name} className="w-8 h-8" />
                                ) : (
                                  <ProductIcon productName={item.name} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  Sold and shipped by {item.category}
                                  <div className="w-3 h-3 bg-gray-300 rounded-full ml-2"></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                              <select
                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                value={item.quantity}
                                onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                              <Trash2
                                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => handleRemoveItem(item.id)}
                              />
                              <div className="text-right">
                                <div className="text-xs text-gray-400 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </div>
                                <div className="font-semibold text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#eb015b] border-[#eb015b] bg-transparent hover:bg-pink-50 text-xs px-3 py-1"
                                onClick={() => trackAction("test_button", item.id)}
                              >
                                Test :)
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>

            <Card className="mt-6 border-pink-200 bg-pink-50">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-[#eb015b] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-pink-700 text-sm">
                    You're $10.00 away from free shipping. Add{" "}
                    <Button
                      variant="link"
                      className="text-[#eb015b] p-0 h-auto text-sm underline"
                      onClick={() => trackAction("add_more_items")}
                    >
                      more items
                    </Button>{" "}
                    to your cart.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Increased width */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 w-full">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">You've selected</span>
                  <Button
                    variant="link"
                    className="text-[#eb015b] p-0 text-sm font-medium"
                    onClick={() => {
                      trackAction("edit_address")
                      setShowAddressDrawer(true)
                    }}
                  >
                    Edit
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="font-medium text-gray-900 text-sm">Shipping address</div>
                  <div className="text-sm text-gray-600">Manhattan, NY, USA</div>
                  <div className="text-sm text-gray-600">
                    {state.expressDelivery ? "Express delivery - Tomorrow" : "Get it by Mon, Jul 28"}
                  </div>
                  <div className="text-right font-semibold text-gray-900">
                    {state.expressDelivery ? "$7.00" : "$2.00"}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Promo code</span>
                    <Button
                      variant="link"
                      className="text-[#eb015b] p-0 text-sm font-medium"
                      onClick={() => {
                        trackAction("promo_code")
                        setShowPromoDrawer(true)
                      }}
                    >
                      {state.promoCode.isValid ? "Applied" : "Add"}
                    </Button>
                  </div>
                  {state.promoCode.isValid && (
                    <div className="text-xs text-gray-600 mt-1">Code: {state.promoCode.code} (5% off)</div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900">Order summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {state.expressDelivery ? "Express Delivery" : "Delivery"}
                    </span>
                    <span className="text-gray-900">${delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discounts</span>
                    <span className="text-gray-600">${discount.toFixed(2)}</span>
                  </div>
                  {state.promoCode.isValid && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Promo ({state.promoCode.code})</span>
                      <span className="text-gray-600">-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 leading-relaxed">
                  By continuing, I accept the{" "}
                  <Button variant="link" className="text-[#eb015b] p-0 h-auto text-xs underline">
                    Terms
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="text-[#eb015b] p-0 h-auto text-xs underline">
                    Privacy Policy
                  </Button>
                  . Tax applied where required.
                </div>

                <Button
                  className="w-full bg-[#eb015b] hover:bg-[#c1014a] text-white font-medium py-3"
                  onClick={() => {
                    trackAction("continue_checkout")
                    router.push("/shipping")
                  }}
                >
                  Continue to Checkout
                </Button>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => trackAction("apple_pay")}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
                      <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                    </svg>
                    Apple Pay
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => trackAction("google_pay")}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Where would you like to receive your order?</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddressModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Add your address to estimate Shipping or see the nearest available pickup store.
              </div>

              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {addressSuggestions.map((address, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-50 cursor-pointer rounded text-sm text-gray-700"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address}
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                Update
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Address Drawer */}
      <AddressDrawer
        isOpen={showAddressDrawer}
        onClose={() => setShowAddressDrawer(false)}
        state={state}
        onUpdateState={onUpdateState}
      />

      {/* Promo Code Drawer */}
      <PromoCodeDrawer
        isOpen={showPromoDrawer}
        onClose={() => setShowPromoDrawer(false)}
        state={state}
        onUpdateState={onUpdateState}
      />

      {/* AI Chat Assistant */}
      <AIChatAssistant
        messages={chatMessages}
        onSendMessage={sendChatMessage}
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
      />
    </div>
  )
}
