import { LayoutDashboard, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AnalyticsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4">
      <div className="p-6 rounded-full bg-primary/10 text-primary animate-pulse">
        <Construction className="w-16 h-16" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Page Under Construction</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Our advanced analytics engine is currently being fine-tuned. 
          Expect deep insights and real-time visualization very soon.
        </p>
      </div>
      <Button asChild className="violet-gradient border-none rounded-full px-8">
        <Link href="/">Back to Studio</Link>
      </Button>
    </div>
  )
}