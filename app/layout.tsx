import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "学中文 · Learn Chinese",
  description: "A modern, friendly Chinese learning app — flashcards, stroke practice, listening, and gamified lessons.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
