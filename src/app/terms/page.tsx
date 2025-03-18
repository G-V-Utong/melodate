/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "@/components/auth-button";
import { useState } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import MenuButton from "@/components/menuButton";
import LoginModal from "@/components/login-modal";
import CreateAccountModal from "@/components/create-account-modal";

export default function TermsOfService() {
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
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Melodate, you accept and agree to be
                bound by these Terms of Service and our Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Service Description</h2>
              <p>
                Melodate is a music search service that allows users to discover
                music by date, genre, and artist. We provide links to music on
                Spotify but do not host any music content directly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You must provide accurate information when creating an account
                </li>
                <li>You are responsible for maintaining account security</li>
                <li>You must not share your account credentials</li>
                <li>
                  We reserve the right to terminate accounts that violate these
                  terms
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                4. Intellectual Property
              </h2>
              <p>
                All content and trademarks on Melodate are owned by their
                respective rights holders. Music information is provided through
                the Spotify API.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                5. Limitations of Liability
              </h2>
              <p>
                Melodate provides music search services &quot;as is&quot; and
                makes no warranties about the accuracy or availability of
                results.
              </p>
            </section>
          </div>
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
