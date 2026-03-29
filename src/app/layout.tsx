import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Podcats-stats",
  description: "Stats to the Podcast Lesezeiten: 2 Girls one Book",
  icons: [
    {
      rel: "icon",
      url: "/podcat-white.png",
      media: "(prefers-color-scheme: dark)",
    },
    { rel: "icon", url: "/podcat.png", media: "(prefers-color-scheme: light)" },
  ]
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="de" className={`${geist.variable}`} suppressHydrationWarning>
        <body className="from-background to-primary bg-linear-to-r from-15% to-150%" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <NavigationMenu className="z-20 fixed">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
