import { Smartphone, Laptop, Headphones, Watch, Package, Zap, Gift, Star } from "lucide-react"

interface RecommendedProductIconProps {
  productName: string
  className?: string
}

export function RecommendedProductIcon({ productName, className = "w-6 h-6" }: RecommendedProductIconProps) {
  const getRecommendedIcon = () => {
    const name = productName.toLowerCase()
    
    // Apple Accessories
    if (name.includes("magsafe") || name.includes("charger")) {
      return (
        <div className={`${className} bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center`}>
          <Zap className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("case") || name.includes("cover")) {
      return (
        <div className={`${className} bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center`}>
          <Package className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("airpods")) {
      return (
        <div className={`${className} bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center`}>
          <Headphones className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("watch") || name.includes("band")) {
      return (
        <div className={`${className} bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center`}>
          <Watch className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("hub") || name.includes("adapter")) {
      return (
        <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center`}>
          <Laptop className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("protector") || name.includes("screen")) {
      return (
        <div className={`${className} bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center`}>
          <Smartphone className="w-4 h-4 text-white" />
        </div>
      )
    }
    
    // Delivery and Premium
    if (name.includes("express") || name.includes("delivery")) {
      return (
        <div className={`${className} bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center`}>
          <Zap className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("premium") || name.includes("premium")) {
      return (
        <div className={`${className} bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center`}>
          <Star className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (name.includes("gift") || name.includes("wrapping")) {
      return (
        <div className={`${className} bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center`}>
          <Gift className="w-4 h-4 text-white" />
        </div>
      )
    }
    
    // Budget alternatives
    if (name.includes("budget") || name.includes("economic") || name.includes("alternative")) {
      return (
        <div className={`${className} bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center`}>
          <Package className="w-4 h-4 text-white" />
        </div>
      )
    }
    
    // Default
    return (
      <div className={`${className} bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center`}>
        <Package className="w-4 h-4 text-white" />
      </div>
    )
  }

  return <div className="flex items-center justify-center">{getRecommendedIcon()}</div>
} 