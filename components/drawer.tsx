"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { CheckoutState } from "../types/checkout"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function AddressDrawer({ isOpen, onClose, state, onUpdateState }: DrawerProps) {
  const [localAddress, setLocalAddress] = useState(state.shippingAddress)

  useEffect(() => {
    setLocalAddress(state.shippingAddress)
  }, [state.shippingAddress])

  const handleAddressChange = (field: keyof typeof localAddress, value: string) => {
    setLocalAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onUpdateState({ shippingAddress: localAddress })
    onClose()
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
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
              <Input
                value={localAddress.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apt, Suite, Building (Optional)</label>
              <Input
                value={localAddress.apt || ""}
                onChange={(e) => handleAddressChange("apt", e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <Select value={localAddress.state} onValueChange={(value) => handleAddressChange("state", value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <Input
                value={localAddress.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
              <Input
                value={localAddress.postalCode}
                onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient name</label>
              <Input
                value={localAddress.recipient}
                onChange={(e) => handleAddressChange("recipient", e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button className="w-full bg-[#eb015b] hover:bg-[#c1014a] text-white font-medium py-3" onClick={handleSave}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
