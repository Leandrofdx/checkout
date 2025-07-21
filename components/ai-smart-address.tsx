"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, MapPin } from "lucide-react"

interface AISmartAddressProps {
  value: string
  onChange: (value: string) => void
  onValidate?: (isValid: boolean, suggestion?: string) => void
  onCEPLookup?: (cep: string) => Promise<any>
  placeholder?: string
  label?: string
}

export function AISmartAddress({
  value,
  onChange,
  onValidate,
  onCEPLookup,
  placeholder = "Digite o endereço",
  label = "Endereço",
}: AISmartAddressProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<"valid" | "invalid" | "pending" | null>(null)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [cepSuggestion, setCepSuggestion] = useState<any>(null)

  // Detecta CEP no input
  const detectCEP = (text: string) => {
    const cepRegex = /\b\d{5}-?\d{3}\b/
    const match = text.match(cepRegex)
    return match ? match[0].replace("-", "") : null
  }

  // Auto-complete por CEP
  useEffect(() => {
    const cep = detectCEP(value)
    if (cep && cep.length === 8 && onCEPLookup) {
      onCEPLookup(cep).then((result) => {
        if (result) {
          setCepSuggestion(result)
        }
      })
    }
  }, [value, onCEPLookup])

  // Validação em tempo real
  useEffect(() => {
    if (value.length > 10) {
      setIsValidating(true)
      setValidationStatus("pending")

      const timer = setTimeout(async () => {
        try {
          if (onValidate) {
            // Validação simples local
            const isValid = value.length > 15 && value.includes(",")
            const suggestionText = isValid ? null : `${value}, New Yourk, USA`

            setValidationStatus(isValid ? "valid" : "invalid")
            setSuggestion(suggestionText)
            onValidate(isValid, suggestionText || undefined)
          }
        } catch (error) {
          console.error("Erro na validação:", error)
          setValidationStatus("valid") // Fallback para válido em caso de erro
        } finally {
          setIsValidating(false)
        }
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setValidationStatus(null)
      setSuggestion(null)
    }
  }, [value, onValidate])

  const applySuggestion = (suggestionText: string) => {
    onChange(suggestionText)
    setSuggestion(null)
    setCepSuggestion(null)
  }

  const applyCEPSuggestion = () => {
    if (cepSuggestion) {
      const fullAddress = `${cepSuggestion.street}, ${cepSuggestion.city}, ${cepSuggestion.state}`
      onChange(fullAddress)
      setCepSuggestion(null)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-10 ${
            validationStatus === "valid"
              ? "border-green-500"
              : validationStatus === "invalid"
                ? "border-red-500"
                : "border-gray-300"
          }`}
        />

        <div className="absolute right-3 top-3">
          {isValidating && (
            <div className="w-4 h-4 border-2 border-[#eb015b] border-t-transparent rounded-full animate-spin" />
          )}
          {validationStatus === "valid" && <CheckCircle className="w-4 h-4 text-green-500" />}
          {validationStatus === "invalid" && <AlertTriangle className="w-4 h-4 text-red-500" />}
        </div>
      </div>

      {/* CEP Auto-complete Suggestion */}
      {cepSuggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Endereço encontrado:</p>
              <p className="text-sm text-blue-700">
                {cepSuggestion.street}, {cepSuggestion.city}, {cepSuggestion.state}
              </p>
              <Button onClick={applyCEPSuggestion} size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white" data-voice-action="use-address">
                Usar este endereço
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Suggestion */}
      {suggestion && validationStatus === "invalid" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">Sugestão de correção:</p>
              <p className="text-sm text-yellow-700">{suggestion}</p>
              <Button
                onClick={() => applySuggestion(suggestion)}
                size="sm"
                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                data-voice-action="apply-correction"
              >
                Aplicar correção
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
