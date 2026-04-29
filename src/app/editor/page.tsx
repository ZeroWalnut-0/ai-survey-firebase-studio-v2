"use client"

import { useState } from "react"
import { 
  ChevronLeft, 
  Settings2, 
  ListOrdered, 
  Plus, 
  GripVertical, 
  Trash2, 
  Copy, 
  Sparkles,
  Zap,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"

type Question = {
  id: string
  text: string
  type: 'text' | 'choice' | 'likert'
  required: boolean
  options?: string[]
}

const mockQuestions: Question[] = [
  { id: '1', text: 'How satisfied are you with our service?', type: 'likert', required: true },
  { id: '2', text: 'What features would you like to see next?', type: 'text', required: false },
  { id: '3', text: 'How did you hear about us?', type: 'choice', options: ['Social Media', 'Friend', 'Ad', 'Other'], required: true },
]

export default function EditorPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [selectedId, setSelectedId] = useState<string | null>(mockQuestions[0].id)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const selectedQuestion = questions.find(q => q.id === selectedId)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left: Outline */}
      <aside className={`border-r flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-72'}`}>
        <div className="p-4 flex items-center justify-between border-b">
          {!isSidebarCollapsed && <span className="font-bold">Outline</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-2">
          {!isSidebarCollapsed && (
            <div className="space-y-1">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedId(q.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm group flex gap-3 transition-colors ${
                    selectedId === q.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="opacity-50">{idx + 1}</span>
                  <span className="truncate">{q.text || 'Untitled Question'}</span>
                </button>
              ))}
              <Button variant="ghost" className="w-full justify-start gap-2 mt-4 text-primary">
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Middle: Canvas */}
      <main className="flex-1 flex flex-col relative">
        <header className="p-4 border-b flex items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="font-bold">Untitled Survey</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Draft · Updated 2m ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="gap-2">Preview</Button>
             <Button className="violet-gradient border-none">Publish Survey</Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-8 bg-muted/20">
          <div className="max-w-2xl mx-auto space-y-6">
             {questions.map((q, idx) => (
               <div 
                 key={q.id}
                 onClick={() => setSelectedId(q.id)}
                 className={`group p-6 rounded-2xl border-2 transition-all cursor-pointer relative ${
                   selectedId === q.id ? 'border-primary bg-background shadow-xl scale-[1.02]' : 'border-transparent bg-background/50 hover:border-muted-foreground/20'
                 }`}
               >
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {/* AI Suggestion Badge */}
                  {idx === 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                         <button className="absolute -top-3 -right-3 w-8 h-8 rounded-full violet-gradient text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                           <Zap className="w-4 h-4" />
                         </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                          <Sparkles className="w-4 h-4" />
                          AI Optimization Suggestion
                        </div>
                        <p className="text-xs text-muted-foreground">
                          "This question might be biased. Try a more neutral phrasing to improve data quality."
                        </p>
                        <div className="p-2 rounded bg-muted text-[10px] font-mono">
                          Revised: "To what extent do you agree with the current service quality?"
                        </div>
                        <Button size="sm" className="w-full violet-gradient h-8 text-xs">Apply Optimization</Button>
                      </PopoverContent>
                    </Popover>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Question {idx + 1}</span>
                      <Badge variant="secondary" className="capitalize text-[10px]">{q.type}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{q.text}</h3>
                    
                    {q.type === 'choice' && (
                      <div className="space-y-2">
                        {q.options?.map((opt, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                            <div className="w-4 h-4 rounded-full border border-primary/50" />
                            <span className="text-sm">{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'likert' && (
                      <div className="flex justify-between items-center gap-2">
                         {[1,2,3,4,5].map(v => (
                           <div key={v} className="flex-1 h-12 rounded-lg border flex items-center justify-center text-sm font-bold bg-muted/30">{v}</div>
                         ))}
                      </div>
                    )}
                  </div>
               </div>
             ))}
             
             <Button variant="dashed" className="w-full py-12 border-2 hover:border-primary/50 hover:text-primary transition-all">
               <Plus className="w-4 h-4 mr-2" />
               Add New Question
             </Button>
          </div>
        </ScrollArea>
      </main>

      {/* Right: Settings */}
      <aside className="w-80 border-l bg-background hidden xl:flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="font-bold">Question Details</span>
        </div>
        
        {selectedQuestion ? (
          <ScrollArea className="flex-1 p-6 space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea 
                  value={selectedQuestion.text} 
                  className="resize-none h-24"
                  onChange={() => {}} // Implemented as read-only for mock
                />
              </div>

              <div className="space-y-2">
                <Label>Response Type</Label>
                <Select defaultValue={selectedQuestion.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Open Ended</SelectItem>
                    <SelectItem value="choice">Multiple Choice</SelectItem>
                    <SelectItem value="likert">Likert Scale (1-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Label>Required Field</Label>
                <Switch checked={selectedQuestion.required} />
              </div>
            </div>

            <div className="pt-8 border-t space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Skip Logic</Label>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary">
                  <Plus className="w-3 h-3 mr-1" /> Add Logic
                </Button>
              </div>
              <div className="p-3 rounded-lg border border-dashed border-primary/20 bg-primary/5 flex items-center justify-between group">
                <div className="text-[10px] space-y-1">
                  <p className="font-bold">If Answer is "Social Media"</p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    Jump to Q4 <ArrowUpRight className="w-2 h-2" />
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="pt-20 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="w-4 h-4" /> Duplicate
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MousePointer2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-muted-foreground">Select a question to edit its properties</p>
          </div>
        )}
      </aside>
    </div>
  )
}

function MousePointer2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="m13 13 6 6" />
    </svg>
  )
}