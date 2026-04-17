import React, { Suspense } from "react"
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import { ScrollProgressIndicator } from "@/components/scroll-progress-indicator";
import { NotificationsProvider } from "@/components/providers/notifications-provider";
import "./globals.css";

/* Elite editorial fonts */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sayed Elshazly | Technical Product Manager",
  description:
    "Technical Product Manager who bridges product strategy and engineering execution. Building products that drive measurable business impact.",
};

export const viewport: Viewport = {
  themeColor: "#F5F3EE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ScrollProgressIndicator />
        <ThemeProvider />
        <NotificationsProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
            <VisitorTracker />
          </Suspense>
          {children}
          <Toaster />
        </NotificationsProvider>
      </body>
    </html>
  );
}
