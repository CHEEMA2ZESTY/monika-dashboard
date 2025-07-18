import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    avatar: string
    username: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Topbar */}
      <header className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#4e54c8] to-[#8f94fb] shadow-md text-white">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden text-white border-white">
              ☰
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#1f1f2f] text-white">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold tracking-wide">Monika Dashboard</h1>

        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-white">
            <AvatarImage
              src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
              alt={user?.username}
            />
            <AvatarFallback>
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <aside className="w-64 p-4 hidden md:block bg-gradient-to-b from-[#1f1f2f] to-[#2f2f3f] border-r text-white">
          <SidebarContent />
        </aside>
        <main className="flex-1 p-6 overflow-y-auto bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void } = {}) {
  const { pathname } = useLocation()

  const links = [
    { to: "/dashboard", label: "📊 Overview" },
    { to: "/dashboard/servers", label: "🛠️ Server Settings" },
    { to: "/dashboard/users", label: "👥 User Manager" },
    { to: "/dashboard/analytics", label: "📈 Analytics" },
  ]

  return (
    <nav className="flex flex-col gap-3 text-sm font-medium">
      {links.map(({ to, label }) => (
        <Link to={to} key={to} onClick={onNavigate}>
          <Button
            variant="ghost"
            className={`w-full justify-start transition-all ${
              pathname === to ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            {label}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
