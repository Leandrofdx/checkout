"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star, TrendingUp, X } from 'lucide-react'
import { RecommendedProductIcon } from "./recommended-product-icon"

interface AIProductRecommendationsProps {
  recommendations: string[]
  onAddProduct: (product: string) => void
  onClose: () => void // NEW: Close prop
}

export function AIProductRecommendations({ recommendations, onAddProduct, onClose }: AIProductRecommendationsProps) {
  if (recommendations.length === 0) return null

  const mockProducts = recommendations.map((name, index) => ({
    id: `rec-${index}`,
    name,
    price: (10 + index * 5).toFixed(2),
    originalPrice: (15 + index * 8).toFixed(2),
    rating: (3.5 + index * 0.3).toFixed(1),
    image: `/placeholder.svg?height=60&width=60&text=${name.slice(0, 2)}`,
  }))

  return (
    <Card className="border-orange-200 bg-orange-50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Recomendações Personalizadas</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-600 hover:bg-gray-100 p-1 h-auto" data-voice-action="close-recommendations">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-orange-700 mb-3">Baseado nos seus itens, você também pode gostar:</p>

        <div className="space-y-3">
          {mockProducts.map((product) => (
            <div key={product.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <RecommendedProductIcon productName={product.name} className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{product.name}</div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="line-through">${product.originalPrice}</span>
                  <span className="font-semibold text-orange-600">${product.price}</span>
                  <span>⭐ {product.rating}</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAddProduct(product.name)}
                className="text-xs px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Adicionar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
