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
import LoginModal from "@/components/login-modal"
import CreateAccountModal from "@/components/create-account-modal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/contexts/AuthContext";

interface Like {
  item_id: string;
  title: string;
  artist: string;
  cover_art: string;
  spotify_url: string;
  type: string;
  year: number;
}

export default function Likes() {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter()

  const handleSwitchToCreateAccount = () => {
    setLoginModalOpen(false);
    setCreateAccountModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setCreateAccountModalOpen(false);
    setLoginModalOpen(true);
  };

  // const handleLoginSuccess = (userData: any) => {
  //   setUser(userData); // Set user data on successful login
  // };

  useEffect(() => {
    async function fetchLikes() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const likesData = await getLikes(user.id);
        setLikes(likesData);
      } catch (error) {
        toast.error("Error fetching likes");
      } finally {
        setLoading(false);
      }
    }
    fetchLikes();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/Melodate Icon.jpg"
              alt="Melodate"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-xl font-bold">Melodate</span>
          </Link>
          <div className="flex items-center">
            <AuthButton
              onLoginClick={() => setLoginModalOpen(true)}
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
            <h1 className="text-2xl font-bold mb-6">Your Favorite Music</h1>
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
                      year={item.year}
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
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToCreateAccount={handleSwitchToCreateAccount}
        // onLoginSuccess={handleLoginSuccess}
      />
      <CreateAccountModal
        isOpen={createAccountModalOpen}
        onClose={() => setCreateAccountModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <footer className="border-t bg-muted relative z-50">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Melodate. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
            <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 