"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddressDrawer } from "./drawer"
import { ProductIcon } from "./product-icons"
import { AIChatAssistant } from "./ai-chat-assistant"
import { useAICheckout } from "../hooks/use-ai-checkout"
import type { CheckoutState } from "../types/checkout"

interface PickupPageProps {
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function PickupPage({ state, onUpdateState }: PickupPageProps) {
  const router = useRouter()
  const [showChat, setShowChat] = useState(false)
  const [showAddressDrawer, setShowAddressDrawer] = useState(false)

  const handleUserInfoChange = (field: keyof typeof state.userInfo, value: string) => {
    onUpdateState({
      userInfo: { ...state.userInfo, [field]: value },
    })
  }

  const handleAddressChange = (field: keyof typeof state.shippingAddress, value: string) => {
    onUpdateState({
      shippingAddress: { ...state.shippingAddress, [field]: value },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-xl font-medium text-gray-900 mb-2">Pickup</h1>
            <div className="text-sm text-gray-600 mb-6">
              Already have an account?{" "}
              <Button variant="link" className="text-[#eb015b] p-0 h-auto">
                Sign in
              </Button>
            </div>

            <div className="text-sm text-gray-600 mb-8">
              Want your order to be delivered to an address?{" "}
              <Button
                variant="link"
                className="text-[#eb015b] p-0 h-auto"
                onClick={() => router.push("/shipping")}
              >
                Change to Shipping.
              </Button>
            </div>

            {/* User Information */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 text-gray-900">Your information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <Input
                    className="border border-gray-300"
                    value={state.userInfo.email}
                    onChange={(e) => handleUserInfoChange("email", e.target.value)}
                    placeholder="user@mail.com.br"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    className="border border-gray-300"
                    value={state.userInfo.fullName}
                    onChange={(e) => handleUserInfoChange("fullName", e.target.value)}
                    placeholder="Full Name User"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    className="border border-gray-300"
                    value={state.userInfo.phone}
                    onChange={(e) => handleUserInfoChange("phone", e.target.value)}
                    placeholder="(201) 545-4411"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-info"
                    className="data-[state=checked]:bg-[#eb015b] data-[state=checked]:border-[#eb015b]"
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
                  />
                  <label htmlFor="subscribe" className="text-sm text-gray-600">
                    Subscribe
                  </label>
                </div>
              </div>
            </div>

            {/* Pickup Store */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 text-gray-900">Options nearest to:</h2>
              <div className="text-sm text-gray-600 mb-4">11 11 E 44th St 11 floor, Manhattan, NY, USA</div>

              <h3 className="font-medium mb-4 text-gray-900">Pickup</h3>
              <Card className="border-[#eb015b] mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#eb015b] rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">USA (3.1 mi)</div>
                        <div className="text-sm text-orange-600">1 item unavailable</div>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">$1.00</div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <div className="font-medium">Earliest pickup on Wed, Jul 23</div>
                    <div>11 11 E 44th St 11 floor, Manhattan, NY, USA</div>
                  </div>

                  <Button variant="link" className="text-[#eb015b] p-0 h-auto text-sm">
                    Show opening hours
                  </Button>
                </CardContent>
              </Card>

              <Button variant="link" className="text-[#eb015b] p-0 h-auto text-sm mb-6">
                Change pickup store
              </Button>
            </div>

            {/* Shipping for unavailable items */}
            <div className="mb-8">
              <h3 className="font-medium mb-4 text-gray-900">Shipping</h3>
              <div className="text-sm text-gray-600 mb-4">
                These items are not available for the pickup store you've selected.
              </div>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <ProductIcon productName="Standard Item" className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Standard Item</div>
                      <Button variant="link" className="text-[#eb015b] p-0 h-auto text-sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-sm text-gray-600 mb-4">Shipping options to: Manhattan, NY, USA</div>

              <div className="space-y-4">
                <Input
                  className="border border-gray-300"
                  placeholder="Street address"
                  value={state.shippingAddress.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                />
                <Input
                  className="border border-gray-300"
                  placeholder="Apt, Suite, Building (Optional)"
                  value={state.shippingAddress.apt || ""}
                  onChange={(e) => handleAddressChange("apt", e.target.value)}
                />
                <Select
                  value={state.shippingAddress.state}
                  onValueChange={(value) => handleAddressChange("state", value)}
                >
                  <SelectTrigger className="border border-gray-300">
                    <SelectValue placeholder="New York" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New York">New York</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="border border-gray-300"
                  placeholder="New York"
                  value={state.shippingAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
                <Input
                  className="border border-gray-300"
                  placeholder="10036"
                  value={state.shippingAddress.postalCode}
                  onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                />
                <Input
                  className="border border-gray-300"
                  placeholder="teste"
                  value={state.shippingAddress.recipient}
                  onChange={(e) => handleAddressChange("recipient", e.target.value)}
                />
              </div>

              <Card className="mt-4 border-[#eb015b]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#eb015b] rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">All countries</div>
                        <div className="font-medium text-gray-900">Get it by Mon, Jul 28</div>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">$1.00</div>
                  </div>
                </CardContent>
              </Card>

              <Button variant="link" className="text-[#eb015b] p-0 h-auto text-sm mt-2">
                Show more shipping options
              </Button>
            </div>
          </div>

          {/* Sidebar - Increased width */}
          <div className="lg:col-span-1">
            <Card className="w-full">
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
                    onUpdateState({
                      pickupStore: "11 E 44th St, Manhattan, NY",
                      pickupDate: "Wednesday, 23 de julho",
                    })
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
    </div>
  )
}
