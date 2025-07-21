import { Smartphone, Laptop, Headphones, Watch, Tablet, Monitor } from "lucide-react"

interface AppleProductIconProps {
  productName: string
  className?: string
}

export function AppleProductIcon({ productName, className = "w-8 h-8" }: AppleProductIconProps) {
  const getAppleIcon = () => {
    const name = productName.toLowerCase()
    
    // iPhone
    if (name.includes("iphone")) {
      return (
        <div className={`${className} bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center`}>
          <Smartphone className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // MacBook
    if (name.includes("macbook")) {
      return (
        <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center`}>
          <Laptop className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // AirPods
    if (name.includes("airpods")) {
      return (
        <div className={`${className} bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center`}>
          <Headphones className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // Apple Watch
    if (name.includes("apple watch") || name.includes("watch")) {
      return (
        <div className={`${className} bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center`}>
          <Watch className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // iPad
    if (name.includes("ipad")) {
      return (
        <div className={`${className} bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center`}>
          <Tablet className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // iMac/Mac Pro
    if (name.includes("imac") || name.includes("mac pro")) {
      return (
        <div className={`${className} bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center`}>
          <Monitor className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // Default Apple product
    return (
      <div className={`${className} bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center`}>
        <Smartphone className="w-5 h-5 text-white" />
      </div>
    )
  }

  return <div className="flex items-center justify-center">{getAppleIcon()}</div>
} 