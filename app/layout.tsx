import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { FloatingDock } from "@/components/ui/floating-dock";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/custom/mode-toggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodeBase Explainer Tool",
  description: "AI-powered codebase analysis and visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-screen",
        "antialiased",
        inter.variable,
        GeistSans.variable,
        "font-sans",
      )}
    >
      <body className="h-screen bg-white text-black flex flex-col overflow-x-hidden">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        
          </ThemeProvider>
        
      </body>
    </html>
  );
}
