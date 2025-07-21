"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, Mail, Phone } from "lucide-react"
import type { CheckoutState } from "../types/checkout"

interface UserAuthProps {
  state: CheckoutState
  onUpdateState: (updates: Partial<CheckoutState>) => void
}

export function UserAuth({ state, onUpdateState }: UserAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSignIn = () => {
    onUpdateState({
      userInfo: {
        ...state.userInfo,
        email: "user@mail.com.br",
        fullName: "John Doe",
        phone: "(201) 545-4411",
      },
    })
  }

  const handleSignUp = () => {
    onUpdateState({
      userInfo: {
        ...state.userInfo,
        email: "newuser@mail.com.br",
        fullName: "Jane Smith",
        phone: "(555) 123-4567",
      },
    })
  }

  const handleGuestCheckout = () => {
    onUpdateState({
      userInfo: {
        ...state.userInfo,
        email: "",
        fullName: "",
        phone: "",
      },
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <User className="w-12 h-12 text-[#eb015b] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? "Create your account to save your information"
                : "Sign in to your account for faster checkout"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <Input
                  placeholder="Enter your email"
                  className="pl-10"
                  defaultValue={state.userInfo.email}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <Input
                    placeholder="Enter your phone"
                    className="pl-10"
                    defaultValue={state.userInfo.phone}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="data-[state=checked]:bg-[#eb015b]" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <Button
              className="w-full bg-[#eb015b] hover:bg-[#c1014a] text-white"
              onClick={isSignUp ? handleSignUp : handleSignIn}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <div className="text-center">
              <button
                className="text-[#eb015b] text-sm hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleGuestCheckout}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
