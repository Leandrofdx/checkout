"use client"

import { useState, useRef, useEffect } from "react"
import { SendHorizonal, X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatProps {
  messages: ChatMessage[]
  onSendMessage: (msg: string) => void
  isOpen: boolean
  onToggle: () => void
}

export const AIChatAssistant = ({ messages, onSendMessage, isOpen, onToggle }: ChatProps) => {
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-[#eb015b] hover:bg-[#c1014a] text-white shadow-lg"
        size="icon"
      >
        <MessageCircle className="size-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 flex h-[450px] w-80 flex-col shadow-lg">
      <CardHeader className="flex items-center justify-between p-3 border-b bg-[#eb015b] text-white min-h-[60px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-sm">Assistente de Compra</span>
          <Button variant="ghost" size="icon" onClick={onToggle} className="text-white hover:bg-[#c1014a] hover:text-white">
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent ref={containerRef} className="flex-1 space-y-2 overflow-y-auto bg-muted p-3 text-sm">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            Olá! Como posso ajudar com sua compra? 😊
          </div>
        )}
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`rounded-md p-2 ${
              m.role === "assistant" ? "bg-background shadow" : "ml-auto bg-primary text-primary-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-3 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!input.trim()) return
            onSendMessage(input.trim())
            setInput("")
          }}
          className="flex w-full items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem…"
            className="flex-1 rounded-md border px-2 py-1 text-sm outline-none"
          />
          <Button type="submit" size="icon" variant="secondary">
            <SendHorizonal className="size-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
