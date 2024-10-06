import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../componets/header/header.js";
import ChatButton from "../componets/chatbutton/ChatButton.js";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "../componets/footer/footer.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Productivity Pro",
  description:
    "Boost your productivity with Productivity Pro! Unlock your potential through engaging flashcards, effective memory exercises, organized note-taking, competitive leaderboards, and a Pomodoro timer to enhance your focus. Join our community today and transform the way you work and study!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main style={{ flex: 1 }}>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
