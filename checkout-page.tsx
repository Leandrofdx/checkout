"use client"

import { useState } from "react"
import { ChevronRight, CreditCard, Building2, Truck, Package, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Component() {
  const [selectedCard, setSelectedCard] = useState("5100")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <span className="text-sm text-gray-600">BUSINESS SOLUTIONS</span>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-blue-600">Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600">Delivery</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Payment</span>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-2xl font-semibold text-gray-900">Payment</h1>

            {/* Saved Cards */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Saved cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Visa Card */}
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedCard === "5100" ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedCard("5100")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-blue-600 font-bold text-lg">VISA</div>
                      <div className="w-8 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <div className="w-4 h-3 bg-blue-600 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">Card IM 5100</div>
                  </CardContent>
                </Card>

                {/* Mastercard */}
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedCard === "1812" ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedCard("1812")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2"></div>
                      </div>
                      <div className="w-8 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">Card IM 1812</div>
                  </CardContent>
                </Card>

                {/* Diners Club */}
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedCard === "1717" ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedCard("1717")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <div className="text-white text-xs font-bold">DC</div>
                      </div>
                      <div className="w-8 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">Card IM 1717</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Other Options */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Other options</h2>
              <div className="space-y-3">
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Credit Card</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Account Billing</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Order Fields */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order fields</h2>
              <div className="space-y-4">
                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Cost center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cc1">Cost Center 1</SelectItem>
                      <SelectItem value="cc2">Cost Center 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-right mt-1">
                    <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                      Select
                    </Button>
                  </div>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="PO Number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="po1">PO-001</SelectItem>
                      <SelectItem value="po2">PO-002</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-right mt-1">
                    <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                      Select
                    </Button>
                  </div>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Release" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="r1">Release 1</SelectItem>
                      <SelectItem value="r2">Release 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-right mt-1">
                    <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-100 border-0">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
                  <span className="text-sm text-gray-600">18 items</span>
                </div>

                {/* User Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">User information</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">S</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Stellar Corp</div>
                      <div className="text-sm text-gray-600">a.mast@stellar.com</div>
                      <div className="text-sm text-gray-600">Stellar</div>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Delivery</h3>
                    <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                      Change
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">Ship to Springfield</div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Express delivery (4 items)</div>
                        <div className="text-sm text-gray-600">Get it tomorrow</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Standard shipping (3 items)</div>
                        <div className="text-sm text-gray-600">06/24/2025</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pickup */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Pickup</h3>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Pickup at Office Depot #597</div>
                      <div className="text-sm text-gray-600">Items available for pickup today</div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">$1,537.15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">$10.90</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pickup</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="text-gray-900">$153.71</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">$1,590.86</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">Place order</Button>

                {/* Terms */}
                <div className="text-xs text-gray-600">
                  By placing an order, I agree to the{" "}
                  <Button variant="link" className="text-blue-600 p-0 h-auto text-xs underline">
                    Terms of Use
                  </Button>
                  . My information will be used as described in the{" "}
                  <Button variant="link" className="text-blue-600 p-0 h-auto text-xs underline">
                    Privacy Notice
                  </Button>
                  .
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
