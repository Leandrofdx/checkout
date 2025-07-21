import { CreditCard, Building2, Receipt, DollarSign } from "lucide-react"

interface PaymentIconProps {
  method: string
  isSelected: boolean
  className?: string
}

export function PaymentIcon({ method, isSelected, className = "w-4 h-4" }: PaymentIconProps) {
  const getIcon = () => {
    switch (method) {
      case "credit":
        return <CreditCard className={`${className} ${isSelected ? "text-white" : "text-gray-600"}`} />
      case "pix":
        return <DollarSign className={`${className} ${isSelected ? "text-white" : "text-gray-600"}`} />
      case "khipu":
        return <Building2 className={`${className} ${isSelected ? "text-white" : "text-gray-600"}`} />
      case "boleto":
        return <Receipt className={`${className} ${isSelected ? "text-white" : "text-gray-600"}`} />
      case "paypal":
        return <Receipt className={`${className} ${isSelected ? "text-white" : "text-gray-600"}`} />
      default:
        return <CreditCard className={`${className} ${isSelected ? "text-white" : "text-gray-600"}`} />
    }
  }

  return getIcon()
}
