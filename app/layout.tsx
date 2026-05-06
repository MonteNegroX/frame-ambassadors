import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PrivyClientProvider from "@/components/providers/PrivyProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SystemProvider } from "@/components/providers/SystemProvider";
import { SystemShell } from "@/components/SystemShell";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FRAME OS | Waitlist",
  description: "Join the Web3 dApp connecting Crypto Projects with KOLs.",
  manifest: "/manifest.json",
  icons: {
    icon: "https://pbs.twimg.com/profile_images/2013212275671224320/t8HXPK64_400x400.jpg",
    shortcut: "https://pbs.twimg.com/profile_images/2013212275671224320/t8HXPK64_400x400.jpg",
    apple: "https://pbs.twimg.com/profile_images/2013212275671224320/t8HXPK64_400x400.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD507",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { MobileNav } from "@/components/navigation/MobileNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 pb-16 sm:pb-0"
        suppressHydrationWarning
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <PrivyClientProvider>
            <SystemProvider>
              <SystemShell>
                {children}
              </SystemShell>
            </SystemProvider>
            <MobileNav />
          </PrivyClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
