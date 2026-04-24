// For adding custom fonts with other frameworks, see:
// https://tailwindcss.com/docs/font-family
import type { Metadata } from "next";
import { Tomorrow, BioRhyme, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const fontSans = Tomorrow({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
});

const fontSerif = BioRhyme({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track Your Job Applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased overflow-x-hidden`}
      >
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
