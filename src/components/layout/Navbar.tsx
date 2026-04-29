"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, LayoutDashboard, FilePlus2, BarChart3, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Studio", href: "/", icon: FilePlus2 },
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 py-3 items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg violet-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gradient">QuestGen AI</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Button variant="secondary" className="gap-2 rounded-full px-5">
          <User className="w-4 h-4" />
          My Page
        </Button>
      </div>
    </nav>
  )
}