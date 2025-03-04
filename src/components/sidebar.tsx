"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isVisible: boolean
}

export function Sidebar({ isVisible }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/',
    },
    {
      label: 'Recent Searches',
      icon: History,
      href: '/recent',
      active: pathname === '/recent',
    },
    {
      label: 'Likes',
      icon: Heart,
      href: '/likes',
      active: pathname === '/likes',
    },
  ]

  if (!isVisible) return null

  return (
    <div className="hidden lg:flex flex-col gap-y-4 h-full w-[300px] p-6 bg-background border-r fixed top-16">
      <div className="flex flex-col gap-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-4 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-lg",
              route.active ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
} 