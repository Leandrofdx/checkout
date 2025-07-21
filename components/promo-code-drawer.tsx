"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { CheckoutState } from "../types/checkout"

interface PromoCodeDrawerProps {
  isOpen: boolean
  onClose: () => void
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function PromoCodeDrawer({ isOpen, onClose, state, onUpdateState }: PromoCodeDrawerProps) {
  const [promoInput, setPromoInput] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const validPromoCodes = ["SAVE5", "DISCOUNT5", "WELCOME5"]

  const handleApplyPromo = async () => {
    setIsApplying(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const isValid = validPromoCodes.includes(promoInput.toUpperCase())

    onUpdateState({
      promoCode: {
        code: promoInput.toUpperCase(),
        discount: isValid ? 0.05 : 0,
        isValid,
      },
    })

    setIsApplying(false)
    if (isValid) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Promo code</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1">
            <Input
              placeholder="Enter promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="mb-4"
            />

            {state.promoCode.code && !state.promoCode.isValid && (
              <p className="text-sm text-red-600 mb-4">Invalid promo code. Try SAVE5, DISCOUNT5, or WELCOME5.</p>
            )}

            {state.promoCode.isValid && (
              <p className="text-sm text-gray-600 mb-4">Promo code "{state.promoCode.code}" applied! 5% discount.</p>
            )}
          </div>

          <div className="pt-6 border-t">
            <Button
              className="w-full bg-[#eb015b] hover:bg-[#c1014a] text-white font-medium py-3"
              onClick={handleApplyPromo}
              disabled={!promoInput.trim() || isApplying}
            >
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
