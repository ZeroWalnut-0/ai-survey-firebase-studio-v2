"use client"

import { useState } from "react"
import { FileUp, Pencil, MessageSquareText, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileDropzone } from "@/components/creator/FileDropzone"
import { ChatbotPanel } from "@/components/creator/ChatbotPanel"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  const handleFileUpload = (file: File) => {
    setIsParsing(true)
    setTimeout(() => {
      setIsParsing(false)
      router.push("/editor?mode=document")
    }, 3000)
  }

  if (isParsing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4">
        <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient">AI Analysis in Progress</h2>
          <p className="text-muted-foreground max-w-md">
            QuestGen AI is meticulously analyzing your document to extract structured survey questions...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1 animate-float">
          <Sparkles className="w-3 h-3 mr-2" />
          The Future of Intelligence Gathering
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Create Smarter Surveys <span className="text-gradient">with AI</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Upload a document, chat with our AI designer, or start from scratch. 
          Professional surveys in seconds, not hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Track 1: Document Upload */}
        <Card className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <FileUp className="w-6 h-6" />
            </div>
            <CardTitle>Start with Document</CardTitle>
            <CardDescription>Upload PDF, Word, or HWPX to generate a survey draft.</CardDescription>
          </CardHeader>
          <CardContent>
            <FileDropzone onFileSelect={handleFileUpload} />
          </CardContent>
        </Card>

        {/* Track 2: Manual Editor */}
        <Card 
          className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => router.push("/editor")}
        >
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
              <Pencil className="w-6 h-6" />
            </div>
            <CardTitle>Create Manually</CardTitle>
            <CardDescription>Build your survey step-by-step with our visual editor.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-muted inline-block">
                <ArrowRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Go straight to the Canvas</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Open Editor</Button>
          </CardFooter>
        </Card>

        {/* Track 3: AI Chatbot */}
        <Card 
          className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer border-primary/20 bg-primary/5"
          onClick={() => setIsChatOpen(true)}
        >
          <div className="absolute top-4 right-4">
            <Badge className="violet-gradient border-none">✨ Recommended</Badge>
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <CardTitle>Converse with AI</CardTitle>
            <CardDescription>Design your survey flow collaboratively with our AI agent.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="flex -space-x-3 justify-center mb-6">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                     <img src={`https://picsum.photos/seed/${i+100}/40/40`} alt="user" />
                   </div>
                 ))}
              </div>
              <p className="text-sm font-medium text-primary">Join 2,400+ designers using AI Chat</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full violet-gradient border-none">Open Chat Panel</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="pt-20 border-t flex flex-col items-center gap-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="font-semibold">Enterprise Grade Security & Compliance</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 grayscale opacity-50">
          <div className="font-bold text-2xl">ACME CORP</div>
          <div className="font-bold text-2xl">GLOBAL TECH</div>
          <div className="font-bold text-2xl">DATA FLOW</div>
          <div className="font-bold text-2xl">INSIGHT CO</div>
        </div>
      </div>

      <ChatbotPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <footer className="mt-24 pt-12 pb-8 border-t text-center space-y-4">
        <div className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-muted/50 text-sm">
          <span className="text-muted-foreground">Powered by</span>
          <span className="font-bold text-gradient">AI Survey Engine</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2024 QuestGen AI. All rights reserved. Professional Grade Survey Solutions.
        </p>
      </footer>
    </div>
  )
}