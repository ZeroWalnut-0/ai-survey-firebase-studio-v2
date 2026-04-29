"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { BarChart3, Users, MousePointer2, AlertCircle, TrendingUp, Sparkles, LayoutDashboard, Trash2, PieChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 border-r hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl border-b text-gradient flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Admin Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: "Overview", icon: TrendingUp, active: true },
            { label: "AI Bouncer", icon: Trash2 },
            { label: "Quota Gauges", icon: PieChart },
            { label: "Revenue", icon: BarChart3 },
            { label: "Settings", icon: MousePointer2 },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="bg-primary/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">FREE PLAN</span>
              <Badge variant="outline" className="text-[10px] h-4">UPGRADE</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Quota Usage</span>
                <span>850 / 1,000</span>
              </div>
              <Progress value={85} className="h-1" />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Platform Overview</h1>
            <p className="text-muted-foreground">Real-time performance metrics for QuestGen AI</p>
          </div>
          <Badge className="bg-green-500/10 text-green-500 border-none px-3 py-1 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Live
          </Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Surveys", value: "124", icon: MousePointer2, trend: "+12%" },
            { label: "Responses", value: "8.4k", icon: Users, trend: "+24%" },
            { label: "Quality Score", value: "98.2%", icon: Sparkles, trend: "+2.1%" },
            { label: "Bouncer Flags", value: "42", icon: AlertCircle, trend: "-5%" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="md:col-span-2">
             <CardHeader>
               <CardTitle>Response Volume</CardTitle>
               <CardDescription>Daily response collection across all active surveys</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px] flex items-end gap-2 pb-2">
                {[40, 60, 45, 80, 100, 70, 90, 65, 85, 110, 130, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border p-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      {h*12}
                    </div>
                  </div>
                ))}
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Quota Gauge</CardTitle>
               <CardDescription>Target: 500 Respondents</CardDescription>
             </CardHeader>
             <CardContent className="flex flex-col items-center justify-center pt-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="96" cy="96" r="88" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      className="text-muted" 
                    />
                    <circle 
                      cx="96" cy="96" r="88" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      strokeDasharray="552.92" 
                      strokeDashoffset={552.92 * (1 - 0.76)}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">76%</span>
                    <span className="text-xs text-muted-foreground">380 / 500</span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 w-full gap-4">
                  <div className="text-center">
                    <div className="text-sm font-bold">Male</div>
                    <div className="text-[10px] text-muted-foreground">180 / 250</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">Female</div>
                    <div className="text-[10px] text-muted-foreground">200 / 250</div>
                  </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </main>
    </div>
  )
}