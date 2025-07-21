"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Contrast, Type, RotateCcw } from "lucide-react"

export function AccessibilityControls() {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(1) // 1 = normal, 2 = large, 3 = extra large

  // Aplicar contraste alto
  const toggleHighContrast = () => {
    const newContrast = !highContrast
    setHighContrast(newContrast)
    
    if (newContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  // Aumentar fonte
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 1, 3)
    setFontSize(newSize)
    applyFontSize(newSize)
  }

  // Diminuir fonte
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 1, 1)
    setFontSize(newSize)
    applyFontSize(newSize)
  }

  // Resetar configurações
  const resetAccessibility = () => {
    setHighContrast(false)
    setFontSize(1)
    document.documentElement.classList.remove('high-contrast')
    applyFontSize(1)
  }

  // Aplicar tamanho da fonte
  const applyFontSize = (size: number) => {
    const root = document.documentElement
    root.style.fontSize = `${100 + (size - 1) * 25}%`
  }

  // Carregar configurações salvas
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast') === 'true'
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '1')
    
    setHighContrast(savedContrast)
    setFontSize(savedFontSize)
    
    if (savedContrast) {
      document.documentElement.classList.add('high-contrast')
    }
    applyFontSize(savedFontSize)
  }, [])

  // Salvar configurações
  useEffect(() => {
    localStorage.setItem('highContrast', highContrast.toString())
    localStorage.setItem('fontSize', fontSize.toString())
  }, [highContrast, fontSize])

  return (
    <div className="flex items-center space-x-2">
      {/* Botão Auto Contraste */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleHighContrast}
        className={`flex items-center space-x-1 ${
          highContrast 
            ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
            : 'hover:bg-gray-50'
        }`}
        title="Alternar contraste alto"
      >
        <Contrast className="w-4 h-4" />
        <span className="text-xs font-medium">Contraste</span>
      </Button>

      {/* Botão Aumentar Fonte */}
      <Button
        variant="outline"
        size="sm"
        onClick={increaseFontSize}
        disabled={fontSize >= 3}
        className="flex items-center space-x-1 hover:bg-gray-50"
        title="Aumentar tamanho da fonte"
      >
        <Type className="w-4 h-4" />
        <span className="text-xs font-medium">A+</span>
      </Button>

      {/* Botão Diminuir Fonte */}
      <Button
        variant="outline"
        size="sm"
        onClick={decreaseFontSize}
        disabled={fontSize <= 1}
        className="flex items-center space-x-1 hover:bg-gray-50"
        title="Diminuir tamanho da fonte"
      >
        <Type className="w-4 h-4" />
        <span className="text-xs font-medium">A-</span>
      </Button>

      {/* Botão Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={resetAccessibility}
        className="flex items-center space-x-1 hover:bg-gray-50"
        title="Resetar configurações de acessibilidade"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-xs font-medium">Reset</span>
      </Button>
    </div>
  )
} 