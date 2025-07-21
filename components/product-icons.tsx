import { 
  Smartphone, 
  Monitor, 
  Headphones, 
  Watch,
  Tablet,
  Camera,
  Gamepad2,
  Speaker
} from "lucide-react"

interface ProductIconProps {
  productName: string
  className?: string
}

export function ProductIcon({ productName, className = "w-6 h-6" }: ProductIconProps) {
  const name = productName.toLowerCase()
  
  // Mapeamento otimizado de produtos para ícones
  if (name.includes("iphone") || name.includes("smartphone")) {
    return <Smartphone className={className} />
  }
  if (name.includes("macbook") || name.includes("laptop") || name.includes("computer")) {
    return <Monitor className={className} />
  }
  if (name.includes("airpods") || name.includes("headphones") || name.includes("earbuds")) {
    return <Headphones className={className} />
  }
  if (name.includes("watch") || name.includes("smartwatch")) {
    return <Watch className={className} />
  }
  if (name.includes("ipad") || name.includes("tablet")) {
    return <Tablet className={className} />
  }
  if (name.includes("camera") || name.includes("photo")) {
    return <Camera className={className} />
  }
  if (name.includes("game") || name.includes("console")) {
    return <Gamepad2 className={className} />
  }
  if (name.includes("speaker") || name.includes("audio")) {
    return <Speaker className={className} />
  }
  
  // Fallback para produtos não mapeados
  return <Smartphone className={className} />
}
