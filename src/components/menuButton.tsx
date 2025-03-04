"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { RxHamburgerMenu } from "react-icons/rx"
import Link from "next/link"

interface MenuButton {
  onLoginClick: () => void
  user?: any
}

export default function MenuButton({ onLoginClick, user, }: MenuButton) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false)
    })
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
  }

//   if (!user) {
//     return (
//       <Button
//         className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
//         onClick={onLoginClick}
//       >
//         Login
//       </Button>
//     )
//   }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ">
        <RxHamburgerMenu className="text-[24px]"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="font-medium">{user ? <Link href="/" >
              Home
            </Link> : <Link href="#">Discover</Link>}</DropdownMenuItem>
        <DropdownMenuItem className="font-medium">{user ? <Link href="/recent" >
              Recent Searches
            </Link> : <Link href="#">New Releases</Link>}</DropdownMenuItem>
        <DropdownMenuItem className="font-medium">{user ? <Link href="/likes" >
              Likes
            </Link> : <Link href="#">Top Charts</Link>}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 