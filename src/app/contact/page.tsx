/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import AuthButton from "@/components/auth-button";
import MenuButton from "@/components/menuButton";
import { useAuth } from "@/components/contexts/AuthContext";
import { useState } from "react";
import LoginModal from "@/components/login-modal";
import CreateAccountModal from "@/components/create-account-modal";
// import { Sidebar } from "@/components/sidebar"
// import { cn } from "@/lib/utils"

export default function ContactPage() {
  const { user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSwitchToCreateAccount = () => {
    setLoginModalOpen(false);
    setCreateAccountModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setCreateAccountModalOpen(false);
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href={"/"} className="cursor-pointer flex items-center gap-1">
            <img
              className="text-primary"
              src="/assets/Melodate Icon.jpg"
              alt="Melodate Icon"
              width={20}
              height={20}
              loading="lazy"
            />
            <h1 className="text-xl font-bold tracking-tight">Melodate</h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {user ? (
              <a
                href="/recent"
                className="text-sm font-medium hover:text-primary"
              >
                Recent Searches
              </a>
            ) : (
              ""
            )}
            {user ? (
              <a
                href="/likes"
                className="text-sm font-medium hover:text-primary"
              >
                My Likes
              </a>
            ) : (
              ""
            )}
          </nav>
          <div className="flex items-center">
            <AuthButton onLoginClick={() => setLoginModalOpen(true)} />
            {user && (
              <div className="lg:hidden">
                <MenuButton
                  user={user}
                  onLoginClick={() => setDropdownOpen((prev) => !prev)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center">Contact Us</h1>
          <p className="text-center text-muted-foreground">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
          <ContactForm />
        </div>
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

      <footer className="border-t bg-muted">
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
  );
}
