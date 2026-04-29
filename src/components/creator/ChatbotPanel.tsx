"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, User, Bot, Sparkles, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { aiChatbotSurveyCreation, type AiChatbotSurveyCreationOutput } from "@/ai/flows/ai-chatbot-survey-creation"

interface ChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: "Hello! I'm your AI Survey Designer. What kind of survey would you like to build today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const response = await aiChatbotSurveyCreation({
        message: userMsg,
        history: messages
      })
      setMessages(prev => [...prev, { role: 'model', content: response.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={cn(
        "fixed right-6 bottom-6 z-[60] w-[400px] flex flex-col glass-morphism rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
        isMinimized ? "h-[64px]" : "h-[600px]",
        "hidden md:flex" // Mobile will handle via full-screen/bottom-sheet (omitted for brevity here but planned in UI specs)
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between violet-gradient text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Survey Designer</h3>
            <span className="text-[10px] opacity-80">Ready to help</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat History */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap",
                    msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-muted/50 rounded-tl-none border"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Type your requirements..." 
                className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" className="violet-gradient" onClick={handleSend} disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}