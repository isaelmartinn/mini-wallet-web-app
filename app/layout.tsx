"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sileo";

import { AuthProvider } from "#auth/session/infrastructure/ui/components";
import { chakraSystem } from "#shared/design-tokens/theme/chakra-theme";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="es"
    >
      <head>
        <title>Mini Wallet</title>
      </head>
      <body className="flex min-h-full flex-col">
        <ChakraProvider value={chakraSystem}>
          <AuthProvider>
            {children}
            <Toaster
              options={{
                duration: 3000,
                fill: "#171717",
                styles: {
                  badge: "bg-white/10!",
                  button: "bg-white/10! hover:bg-white/15!",
                  description: "text-white/75!",
                  title: "text-white!",
                },
              }}
              position="top-right"
            />
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
