import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/ui/toaster";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "~/src/components/Navbar";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsUp",
  description: "A chat application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
