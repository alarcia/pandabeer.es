import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const uiFont = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const captureFont = localFont({
  src: "./fonts/Capture-It.ttf",
  variable: "--font-capture",
});

export const metadata: Metadata = {
  title: "PandaBeer",
  description: "Public website for PandaBeer.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${uiFont.variable} ${displayFont.variable} ${captureFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text">{children}</body>
    </html>
  );
}
