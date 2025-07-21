"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle } from "lucide-react"
import { PaymentIcon } from "./payment-icons"
import { AddressDrawer } from "./drawer"
import { AIChatAssistant } from "./ai-chat-assistant"
import { AIFraudDetector } from "./ai-fraud-detector"
import { AIPaymentAdvisor } from "./ai-payment-advisor"
import { useAICheckout } from "../hooks/use-ai-checkout"
import type { CheckoutState } from "../types/checkout"

interface PaymentPageProps {
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function PaymentPage({ state, onUpdateState }: PaymentPageProps) {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<"credit" | "pix" | "khipu" | "boleto" | "paypal">("credit")
  const [showAddressDrawer, setShowAddressDrawer] = useState(false)

  const {
    analysis,
    chatMessages,
    showChat,
    setShowChat,
    sendChatMessage,
    trackAction,
  } = useAICheckout(state)

  const handleGiftCardToggle = (enabled: boolean) => {
    trackAction("gift_card_toggle", enabled)
    onUpdateState({ giftCardEnabled: enabled })
  }

  const handlePaymentSelect = (method: typeof selectedPayment) => {
    trackAction("payment_method_select", method)
    setSelectedPayment(method)
    onUpdateState({ paymentMethod: method })
  }

  const handlePurchase = () => {
    trackAction("purchase_complete")
    const orderNumber = "#2315340993608"
    onUpdateState({
      step: "success",
      orderNumber,
    })
    router.push("/success")
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const promoDiscount = state.promoCode.isValid ? subtotal * state.promoCode.discount : 0
  const delivery = 2.0
  const discount = -60.0 - promoDiscount
  const total = subtotal + delivery + discount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-xl font-medium text-gray-900 mb-6">Payment</h1>

            {/* AI Fraud Detection - EM TEMPO REAL EM TODAS AS TELAS */}
            {analysis && (analysis.fraudScore > 0 || analysis.behaviorFlags.length > 0) && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AIFraudDetector
                  fraudScore={analysis.fraudScore}
                  behaviorFlags={analysis.behaviorFlags}
                />
              </div>
            )}

            {/* AI Payment Advisor */}
            {analysis?.suggestions?.payment && (
              <AIPaymentAdvisor
                currentMethod={selectedPayment}
                suggestions={analysis.suggestions}
                onMethodChange={(method) => handlePaymentSelect(method as typeof selectedPayment)}
              />
            )}

            {/* Gift Card */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="gift-card"
                  checked={state.giftCardEnabled}
                  onCheckedChange={handleGiftCardToggle}
                  className="data-[state=checked]:bg-[#eb015b] data-[state=checked]:border-[#eb015b]"
                />
                <label htmlFor="gift-card" className="text-sm font-medium text-gray-900">
                  Use gift card
                </label>
              </div>

              {state.giftCardEnabled && (
                <Input
                  placeholder="Code"
                  value={state.giftCardCode}
                  onChange={(e) => {
                    trackAction("gift_card_code_change", e.target.value)
                    onUpdateState({ giftCardCode: e.target.value })
                  }}
                  className="max-w-md border-gray-300"
                />
              )}
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              {/* Credit Card */}
              <Card
                className={`cursor-pointer transition-all border ${
                  selectedPayment === "credit" ? "border-[#eb015b] bg-pink-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePaymentSelect("credit")}
                data-voice-action="payment-credit"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded ${selectedPayment === "credit" ? "bg-[#eb015b]" : "bg-gray-100"}`}>
                      <PaymentIcon method="credit" isSelected={selectedPayment === "credit"} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Credit card</div>
                      <div className="text-xs text-gray-500">Amex, Visa, Mastercard, or Elo</div>
                    </div>
                  </div>

                  {selectedPayment === "credit" && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                      <Input
                        placeholder="Card number"
                        className="border-gray-300"
                        onFocus={() => trackAction("card_number_focus")}
                      />
                      <Input
                        placeholder="Name on card"
                        className="border-gray-300"
                        onFocus={() => trackAction("card_name_focus")}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          placeholder="Exp MM/YY"
                          className="border-gray-300"
                          onFocus={() => trackAction("card_exp_focus")}
                        />
                        <div className="relative">
                          <Input
                            placeholder="CVV"
                            className="border-gray-300 pr-8"
                            onFocus={() => trackAction("card_cvv_focus")}
                          />
                          <HelpCircle className="w-4 h-4 text-gray-400 absolute right-2 top-3" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="billing-address"
                          defaultChecked
                          className="data-[state=checked]:bg-[#eb015b] data-[state=checked]:border-[#eb015b]"
                          onCheckedChange={() => trackAction("billing_address_toggle")}
                        />
                        <label htmlFor="billing-address" className="text-sm text-gray-700">
                          Use shipping address for billing
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pix */}
              <Card
                className={`cursor-pointer transition-all border ${
                  selectedPayment === "pix" ? "border-[#eb015b] bg-pink-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePaymentSelect("pix")}
                data-voice-action="payment-pix"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${selectedPayment === "pix" ? "bg-[#eb015b]" : "bg-gray-100"}`}>
                      <PaymentIcon method="pix" isSelected={selectedPayment === "pix"} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Pix</div>
                      <div className="text-xs text-gray-500">Immediate approval</div>
                      <div className="text-xs text-gray-500">
                        The payment code will be generated after completing the order
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Khipu */}
              <Card
                className={`cursor-pointer transition-all border ${
                  selectedPayment === "khipu" ? "border-[#eb015b] bg-pink-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePaymentSelect("khipu")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${selectedPayment === "khipu" ? "bg-[#eb015b]" : "bg-gray-100"}`}>
                      <PaymentIcon method="khipu" isSelected={selectedPayment === "khipu"} />
                    </div>
                    <div className="font-medium text-gray-900">Khipu</div>
                  </div>
                </CardContent>
              </Card>

              {/* Boleto Bancário */}
              <Card
                className={`cursor-pointer transition-all border ${
                  selectedPayment === "boleto" ? "border-[#eb015b] bg-pink-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePaymentSelect("boleto")}
                data-voice-action="payment-boleto"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${selectedPayment === "boleto" ? "bg-[#eb015b]" : "bg-gray-100"}`}>
                      <PaymentIcon method="boleto" isSelected={selectedPayment === "boleto"} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Boleto Bancário</div>
                      <div className="text-xs text-gray-500">Bank slip payment method - Pay at any bank or online</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PayPal */}
              <Card
                className={`cursor-pointer transition-all border ${
                  selectedPayment === "paypal" ? "border-[#eb015b] bg-pink-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePaymentSelect("paypal")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${selectedPayment === "paypal" ? "bg-[#eb015b]" : "bg-gray-100"}`}>
                      <PaymentIcon method="paypal" isSelected={selectedPayment === "paypal"} />
                    </div>
                    <div className="font-medium text-gray-900">PayPal</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Summary - Increased width */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 w-full">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Order summary</h3>
                  <span className="text-sm text-gray-600">4 items - $171.33</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Delivery</span>
                    <Button
                      variant="link"
                      className="text-[#eb015b] p-0 text-sm font-medium"
                      onClick={() => {
                        trackAction("edit_delivery")
                        setShowAddressDrawer(true)
                      }}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="font-medium text-gray-900">teste</div>
                    <div className="text-gray-600">user@mail.com.br</div>
                    <div className="text-gray-600">1535 Broadway, NY, USA</div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-[#eb015b] rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                    <div className="flex-1 flex justify-between">
                      <span className="font-medium text-[#eb015b]">Shipping</span>
                      <span className="text-gray-900">$2.00</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Get it by Mon, Jul 28</div>
                    <div>Fastest</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-900">${delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discounts</span>
                    <span className="text-gray-600">-$60.00</span>
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

                <Button
                  className="w-full bg-[#eb015b] hover:bg-[#c1014a] text-white font-medium py-3"
                  onClick={handlePurchase}
                  data-voice-action="buy-now"
                >
                  BUY NOW
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Drawer */}
      <AddressDrawer
        isOpen={showAddressDrawer}
        onClose={() => setShowAddressDrawer(false)}
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
