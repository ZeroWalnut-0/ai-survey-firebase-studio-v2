
"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, User, Bot, Sparkles, Minimize2, Maximize2, ArrowRight, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { aiChatbotSurveyCreation, type AiChatbotSurveyCreationOutput } from "@/ai/flows/ai-chatbot-survey-creation"
import { useRouter } from "next/navigation"

interface Message {
  role: 'user' | 'model'
  content: string
  preview?: AiChatbotSurveyCreationOutput['surveyStructurePreview']
  cta?: string
}

interface ChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const router = useRouter()
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "반갑습니다! 저는 AI 설문 디자이너입니다. 오늘 어떤 주제로 설문을 만들어볼까요?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const result = await aiChatbotSurveyCreation({
        message: userMsg,
        history: messages.map(({ role, content }) => ({ role, content }))
      })
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: result.response,
        preview: result.surveyStructurePreview,
        cta: result.ctaButton
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCtaClick = () => {
    router.push("/editor?mode=ai-chat")
  }

  if (!isOpen) return null

  return (
    <div 
      className={cn(
        "fixed right-6 bottom-6 z-[60] w-[420px] flex flex-col glass-morphism rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden border-primary/20",
        isMinimized ? "h-[64px]" : "h-[650px]",
        "hidden md:flex"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between violet-gradient text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Survey Designer</h3>
            <span className="text-[10px] opacity-80 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Online
            </span>
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
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-primary text-white" : "bg-muted text-muted-foreground border"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className={cn(
                      "p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm",
                      msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-muted/50 rounded-tl-none border"
                    )}>
                      {msg.content}
                    </div>
                    
                    {/* Survey Structure Preview Card */}
                    {msg.preview && (
                      <Card className="border-primary/20 bg-background/50 overflow-hidden">
                        <div className="p-3 border-b bg-primary/5 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider">Suggested Structure</span>
                        </div>
                        <CardContent className="p-3 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Questions</span>
                            <Badge variant="secondary" className="font-bold">{msg.preview.questionCount}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {msg.preview.questionTypes.map((type, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] bg-background/50">{type}</Badge>
                            ))}
                          </div>
                          {msg.cta && (
                            <Button 
                              size="sm" 
                              className="w-full text-xs h-8 violet-gradient border-none group"
                              onClick={handleCtaClick}
                            >
                              {msg.cta}
                              <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted/30 p-3 rounded-2xl rounded-tl-none border">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="설문 요구사항을 말씀해 주세요..." 
                className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button size="icon" className="violet-gradient shrink-0 shadow-lg" onClick={handleSend} disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
