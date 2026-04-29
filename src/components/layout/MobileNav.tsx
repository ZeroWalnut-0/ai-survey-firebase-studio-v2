"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FilePlus2, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { label: "Home", href: "/", icon: FilePlus2 },
  { label: "Admin", href: "/admin", icon: LayoutDashboard },
  { label: "Stats", href: "/analytics", icon: BarChart3 },
  { label: "Me", href: "/me", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 backdrop-blur-lg px-6 py-3 pb-6 flex items-center justify-between">
      {mobileNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}