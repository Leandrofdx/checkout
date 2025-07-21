"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AddressDrawer } from "./drawer"
import { ProductIcon } from "./product-icons"
import { AIChatAssistant } from "./ai-chat-assistant"
import { AISmartAddress } from "./ai-smart-address"
import { AIFraudDetector } from "./ai-fraud-detector"
import { useAICheckout } from "../hooks/use-ai-checkout"
import type { CheckoutState } from "../types/checkout"

interface ShippingPageProps {
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function ShippingPage({ state, onUpdateState }: ShippingPageProps) {
  const router = useRouter()
  const [showAddressDrawer, setShowAddressDrawer] = useState(false)

  const {
    analysis,
    chatMessages,
    showChat,
    setShowChat,
    sendChatMessage,
    validateAddress,
    getAddressByCEP,
    trackAction,
  } = useAICheckout(state)

  const handleUserInfoChange = (field: keyof typeof state.userInfo, value: string) => {
    trackAction("user_info_change", { field, value })
    onUpdateState({
      userInfo: { ...state.userInfo, [field]: value },
    })
  }

  const handleAddressChange = (value: string) => {
    trackAction("address_change", value)
    onUpdateState({
      shippingAddress: { ...state.shippingAddress, street: value },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-xl font-medium text-gray-900 mb-2">Shipping</h1>
            <div className="text-sm text-gray-600 mb-6">
              Already have an account?{" "}
              <Button variant="link" className="text-[#eb015b] p-0 h-auto" onClick={() => trackAction("sign_in_click")}>
                Sign in
              </Button>
            </div>

            <div className="text-sm text-gray-600 mb-8">
              Want to pickup your order at a store?{" "}
              <Button
                variant="link"
                className="text-[#eb015b] p-0 h-auto"
                onClick={() => {
                  trackAction("change_to_pickup")
                  onUpdateState({ step: "pickup" })
                }}
              >
                Change to Pickup.
              </Button>
            </div>

            {/* AI Fraud Detection - EM TEMPO REAL EM TODAS AS TELAS */}
            {analysis && (analysis.fraudScore > 0 || analysis.behaviorFlags.length > 0) && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <AIFraudDetector
                  fraudScore={analysis.fraudScore}
                  behaviorFlags={analysis.behaviorFlags}
                />
              </div>
            )}

            {/* User Information */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Your information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <Input
                    value={state.userInfo.email}
                    onChange={(e) => handleUserInfoChange("email", e.target.value)}
                    placeholder="user@mail.com.br"
                    className="border-gray-300"
                    onFocus={() => trackAction("email_focus")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    value={state.userInfo.fullName}
                    onChange={(e) => handleUserInfoChange("fullName", e.target.value)}
                    placeholder="Full Name User"
                    className="border-gray-300"
                    onFocus={() => trackAction("name_focus")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    value={state.userInfo.phone}
                    onChange={(e) => handleUserInfoChange("phone", e.target.value)}
                    placeholder="(201) 545-4411"
                    className="border-gray-300"
                    onFocus={() => trackAction("phone_focus")}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-info"
                    className="data-[state=checked]:bg-[#eb015b] data-[state=checked]:border-[#eb015b]"
                    onCheckedChange={() => trackAction("save_info_toggle")}
                  />
                  <label htmlFor="save-info" className="text-sm text-gray-600">
                    Save my personal info for a faster checkout
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    defaultChecked
                    className="data-[state=checked]:bg-[#eb015b] data-[state=checked]:border-[#eb015b]"
                    onCheckedChange={() => trackAction("newsletter_toggle")}
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    I'd like to receive news and offers via email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="subscribe"
                    defaultChecked
                    className="data-[state=checked]:bg-[#eb015b] data-[state=checked]:border-[#eb015b]"
                    onCheckedChange={() => trackAction("subscribe_toggle")}
                  />
                  <label htmlFor="subscribe" className="text-sm text-gray-600">
                    Subscribe
                  </label>
                </div>
              </div>
            </div>

            {/* AI Smart Shipping Address */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              <AISmartAddress
                value={state.shippingAddress.street}
                onChange={handleAddressChange}
                onValidate={(isValid, suggestion) => {
                  // Função wrapper para compatibilidade
                  console.log("Address validation:", { isValid, suggestion })
                }}
                onCEPLookup={getAddressByCEP}
                placeholder="Enter your full address"
                label="Street Address"
              />

              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-sm text-gray-600">Options to:</div>
                  <div className="font-medium">Manhattan, NY, USA</div>
                </div>
                <Button
                  variant="link"
                  className="text-[#eb015b] p-0"
                  onClick={() => {
                    trackAction("edit_address")
                    setShowAddressDrawer(true)
                  }}
                  data-voice-action="edit-address"
                >
                  Edit Address
                </Button>
              </div>
            </div>

            {/* Shipping Option */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Shipping option</h2>
              <Card className="border-[#eb015b]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#eb015b] rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Fastest</div>
                        <div className="font-medium">Get it by Mon, Jul 28</div>
                      </div>
                    </div>
                    <div className="font-medium">$2.00</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Increased width */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm rounded-lg w-full">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-semibold text-gray-900">Cart</h3>
                <div className="text-sm text-gray-500">4 items - $171.33</div>

                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 py-2">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <ProductIcon productName={item.name} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
                      <div className="text-sm font-medium text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#eb015b] border-[#eb015b] text-xs bg-transparent hover:bg-pink-50 flex-shrink-0"
                      onClick={() => trackAction("test_button", item.id)}
                    >
                      Test :)
                    </Button>
                  </div>
                ))}

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>To be calculated</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span>To be calculated</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discounts</span>
                    <span className="text-gray-600">-$60.00</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 pt-4 border-t">
                  The total amount will be calculated on the next page.
                </div>

                <Button
                  className="w-full bg-[#eb015b] hover:bg-[#c1014a] text-white font-medium py-3"
                  onClick={() => {
                    trackAction("go_to_payment")
                    router.push("/payment")
                  }}
                  data-voice-action="go-to-payment"
                >
                  Go to payment
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
