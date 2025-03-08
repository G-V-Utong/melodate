/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { getLikes, supabase } from "@/lib/supabase"
import { MusicCard } from "@/components/MusicCard"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import AuthButton from "@/components/auth-button"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import MenuButton from "@/components/menuButton"
import type { User } from '@supabase/supabase-js'

interface Like {
  item_id: string;
  title: string;
  artist: string;
  cover_art: string;
  spotify_url: string;
  type: string;
}

export default function Likes() {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    async function fetchLikes() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          const likesData = await getLikes(user.id)
          setLikes(likesData)
        }
      } catch (error) {
        toast.error("Error fetching likes")
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/Melodate Icon.jpg"
              alt="Melodate"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-xl font-bold">Melodate</span>
          </Link>
          <div className="flex items-center gap-4">
            <AuthButton
              onLoginClick={() => {}}
              user={user}
              handleLogout={handleLogout}
            />
            <div className="lg:hidden">
              <MenuButton
                user={user}
                onLoginClick={() => setDropdownOpen(prev => !prev)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isVisible={!!user} />
        <main className={cn(
          "flex-1 overflow-y-auto py-8",
          user ? "md:w-[calc(100%-300px)] md:ml-[300px]" : ""
        )}>
          <div className="container">
            <h1 className="text-2xl font-bold mb-6">Your Liked Songs</h1>
            {loading ? <p>Loading...</p> : (user ? (
              likes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {likes.map((item: any) => (
                    <MusicCard
                      key={item.item_id}
                      id={item.item_id}
                      title={item.title}
                      artist={item.artist}
                      coverArt={item.cover_art}
                      url={item.spotify_url}
                      type={item.type}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You haven&apos;t liked any songs yet. Start exploring and like some songs!
                </p>
              )
            ) : (
              <p className="text-center text-muted-foreground">
                Please log in to view your liked songs.
              </p>
            ))}
          </div>
        </main>
      </div>
      <footer className="border-t bg-muted relative z-50">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Melodate. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 