"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Volume2, X, HelpCircle } from "lucide-react"

export function VoiceHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const commands = [
    {
      category: "Produtos",
      commands: [
        { command: "Adicione um iPhone", description: "Adiciona iPhone 15 Pro Max ao carrinho" },
        { command: "Adicione um MacBook", description: "Adiciona MacBook Air M2 ao carrinho" },
        { command: "Adicione AirPods", description: "Adiciona AirPods Pro ao carrinho" },
        { command: "Adicione AirPods Pro", description: "Adiciona AirPods Pro ao carrinho" },
        { command: "Adicione um Watch", description: "Adiciona Apple Watch ao carrinho" },
        { command: "Remova o iPhone", description: "Remove iPhone do carrinho" },
        { command: "Remova os AirPods", description: "Remove AirPods do carrinho" },
        { command: "Mude quantidade do iPhone para 3", description: "Altera quantidade do produto" },
        { command: "Mude quantidade dos AirPods para 2", description: "Altera quantidade dos AirPods" },
      ]
    },
    {
      category: "Entrega",
      commands: [
        { command: "Mude para pickup", description: "Altera para retirada na loja" },
        { command: "Mude para shipping", description: "Altera para entrega em casa" },
        { command: "Ative entrega expressa", description: "Ativa entrega expressa" },
        { command: "Aplicar correção", description: "Aplica sugestão de correção de endereço" },
        { command: "Usar endereço", description: "Usa endereço sugerido do CEP" },
        { command: "Editar endereço", description: "Abre editor de endereço" },
      ]
    },
    {
      category: "Navegação",
      commands: [
        { command: "Próxima página", description: "Avança seguindo o fluxo: Cart → Shipping → Payment" },
        { command: "Continuar", description: "Avança para próxima página (exclusivo)" },
        { command: "Voltar", description: "Volta seguindo o fluxo: Payment → Shipping → Cart" },
        { command: "Onde estou", description: "Mostra em qual página você está" },
        { command: "Tela 1", description: "Vai para Cart" },
        { command: "Tela 2", description: "Vai para Shipping" },
        { command: "Tela 3", description: "Vai para Payment" },
        { command: "Vá para pagamento", description: "Navega diretamente para página de pagamento" },
        { command: "Vá para envio", description: "Navega diretamente para página de envio" },
        { command: "Volte para carrinho", description: "Volta diretamente para página do carrinho" },
      ]
    },
    {
      category: "Informações Pessoais",
      commands: [
        { command: "Editar endereço", description: "Abre edição de endereço" },
        { command: "Email joao@gmail.com", description: "Define email do usuário" },
        { command: "Nome João Silva", description: "Define nome do usuário" },
        { command: "Telefone (11) 99999-9999", description: "Define telefone do usuário" },
      ]
    },
    {
      category: "Pagamento",
      commands: [
        { command: "PIX", description: "Altera método para PIX" },
        { command: "PICS", description: "Altera método para PIX" },
        { command: "Cartão", description: "Altera método para cartão" },
        { command: "Pagar agora", description: "Processa o pagamento" },
        { command: "BUY NOW", description: "Finaliza o pedido e vai para confirmação" },
      ]
    },
    {
      category: "Confirmação",
      commands: [
        { command: "Novo pedido", description: "Volta para fazer novo pedido" },
        { command: "Imprimir comprovante", description: "Imprime o comprovante" },
        { command: "Voltar ao início", description: "Volta para a página inicial" },
      ]
    },
    {
      category: "Acessibilidade",
      commands: [
        { command: "Alto contraste", description: "Ativa modo de alto contraste" },
        { command: "Aumentar fonte", description: "Aumenta o tamanho da fonte" },
        { command: "Diminuir fonte", description: "Diminui o tamanho da fonte" },
        { command: "Reset acessibilidade", description: "Resetar configurações de acessibilidade" },
      ]
    },
    {
      category: "Utilitários",
      commands: [
        { command: "Limpe o carrinho", description: "Remove todos os produtos" },
        { command: "Fechar chat", description: "Fecha o chat de assistente" },
        { command: "Fechar recomendações", description: "Fecha o card de recomendações" },
        { command: "Ajuda", description: "Mostra esta lista de comandos" },
      ]
    },
    {
      category: "Ativação",
      commands: [
        { command: "VOZ", description: "Ativa comandos de voz (nome principal)" },
        { command: "ShopEase", description: "Ativa comandos de voz" },
        { command: "Compras", description: "Ativa comandos de voz" },
        { command: "Loja", description: "Ativa comandos de voz" },
        { command: "Checkout", description: "Ativa comandos de voz" },
        { command: "Assistente", description: "Ativa comandos de voz" },
        { command: "Desativar", description: "Desativa comandos de voz" },
        { command: "Parar", description: "Desativa comandos de voz" },
        { command: "Tchau", description: "Desativa comandos de voz" },
      ]
    }
  ]

  return (
    <>
      {/* Botão de Ajuda */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg bg-gray-600 hover:bg-gray-700"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal de Ajuda */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-[#eb015b]" />
                  <CardTitle>Comandos de Voz Disponíveis</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Clique no botão de microfone no canto inferior direito para ativar os comandos de voz.
              </div>
              
              {commands.map((category, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-1">
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.commands.map((cmd, cmdIndex) => (
                      <div key={cmdIndex} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                        <Volume2 className="w-4 h-4 text-[#eb015b] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            "{cmd.command}"
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {cmd.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-sm text-blue-900">
                    <strong>Dica:</strong> Fale claramente e use comandos simples. 
                    O sistema reconhece variações dos comandos listados acima.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
} 