import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Searchbar } from "./components/Searchbar";
import Navbar from "./components/Navbar";
import PlayerProvider from "./context/PlayerContext";
import PlayerOverlay from "./components/player/PlayerOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PlayerProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-screen h-[100dvh] overflow-hidden flex justify-center`}>
          <PlayerOverlay />
          <Navbar />
          <div className="md:ml-[62px] gap-4 grid grow grid-rows-[auto_1fr] p-4 max-w-[2000px]">
            <Searchbar />
            <main className="relative overflow-auto p-3">
              {children}
            </main>
          </div>
        </body>
      </PlayerProvider>
    </html>
  );
}
