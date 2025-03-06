/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
// import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import ForgotPasswordModal from "./forgot-password-modal"
import { PasswordInput } from "@/components/ui/password-input"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToCreateAccount: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToCreateAccount, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast.success('Logged in successfully')
        onLoginSuccess(data.user)
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome back</DialogTitle>
          <DialogDescription>Sign in to your Melodate account to continue your musical journey</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  handleForgotPassword()
                }}
              >
                Forgot password?
              </Button>
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-0">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="h-auto p-0" onClick={onSwitchToCreateAccount}>
              Create an account
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={handleBackToLogin}
      />
    </Dialog>
  )
}

