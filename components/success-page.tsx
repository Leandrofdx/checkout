"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, CreditCard, DollarSign } from "lucide-react"
import type { CheckoutState } from "../types/checkout"

interface SuccessPageProps {
  state: CheckoutState
}

export function SuccessPage({ state }: SuccessPageProps) {
  const getPaymentMethodIcon = () => {
    switch (state.paymentMethod) {
      case "credit":
        return <CreditCard className="w-5 h-5 text-gray-600" />
      case "pix":
        return <DollarSign className="w-5 h-5 text-gray-600" />
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />
    }
  }

  const getPaymentMethodName = () => {
    switch (state.paymentMethod) {
      case "credit":
        return "Credit Card"
      case "pix":
        return "Pix"
      case "paypal":
        return "PayPal"
      case "boleto":
        return "Boleto Bancário"
      case "khipu":
        return "Khipu"
      default:
        return "Credit Card"
    }
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const promoDiscount = state.promoCode.isValid ? subtotal * state.promoCode.discount : 0
  const delivery = 2.0
  const discount = -60.0 - promoDiscount
  const total = subtotal + delivery + discount

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Thank you for your order!</h1>
        <h2 className="text-lg sm:text-xl text-gray-600 mb-8">Your purchase has been confirmed.</h2>

        <Card className="bg-white rounded-lg shadow-md mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Order Number */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Order Number</p>
                <p className="text-xl font-bold text-gray-900">{state.orderNumber}</p>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-center space-x-3 py-4 border-t border-b border-gray-200">
                {getPaymentMethodIcon()}
                <span className="font-medium text-gray-900">Paid with {getPaymentMethodName()}</span>
              </div>

              {/* Total Amount */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
                {state.promoCode.isValid && (
                  <p className="text-sm text-gray-600 mt-1">
                    Includes {state.promoCode.code} discount (-${promoDiscount.toFixed(2)})
                  </p>
                )}
              </div>

              {/* Email Confirmation */}
              <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  A confirmation email has been sent to:{" "}
                  <span className="font-medium text-gray-900">{state.userInfo.email}</span>
                </p>
                <p>If you don't see it in your inbox, please check your spam folder.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            className="bg-[#eb015b] hover:bg-[#c1014a] text-white font-semibold px-8 py-3 rounded-md"
            onClick={() => window.location.reload()}
          >
            Start New Order
          </Button>

          <Button variant="outline" className="text-[#eb015b] border-[#eb015b] hover:bg-pink-50 bg-transparent">
            View Order Details
          </Button>
        </div>
      </div>
    </div>
  )
}
