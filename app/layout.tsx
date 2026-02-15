import React, { Suspense } from "react"
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Cinzel, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { NotificationsProvider } from "@/components/providers/notifications-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sayed Elshazly | Technical Product Manager",
  description:
    "Technical Product Manager who bridges product strategy and engineering execution. Building products that drive measurable business impact.",
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${cinzel.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider />
        <NotificationsProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
          <Toaster />
        </NotificationsProvider>
      </body>
    </html>
  );
}
