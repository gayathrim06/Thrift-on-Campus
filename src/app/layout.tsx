import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Thrift in Campus — Buy Smart. Sell Easy.",
  description:
    "Discover affordable finds from students around your campus. Buy and sell pre-owned items the smart way.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased text-[#f8fafc]`}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
