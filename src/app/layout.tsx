import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
import { AuthProvider } from "@/components/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://melodate.com.ng"),
  title: "Melodate",
  description:
    "Search for songs and music albums by date. You can now discover music from your favourite genres during certain time periods.",
  openGraph: {
    title: "Melodate",
    description:
      "Search for songs and music albums by date. You can now discover music from your favourite genres during certain time periods.",
    url: "https://www.melodate.com.ng",
    siteName: "Melodate",
    images: [
      {
        url: "/assets/iPad Pro 12.9_ - 1.png",
        width: 1260,
        height: 800,
      },
    ],
    locale: "en-EN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
