import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import PlayerProvider from "./context/PlayerContext";
import PlayerOverlay from "./components/player/PlayerOverlay";
import ServerListProvider from "./context/ServersContext";
import Topbar from "./components/Topbar";
import { Toaster } from "sonner";
import WizardProvider from "./context/WizardContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FMDb",
  description: "Filip's Movie Database",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollbarWidth: "none" }}>
      <WizardProvider>
        <PlayerProvider>
          <ServerListProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased relative h-[100dvh] flex justify-center`}
            >
              <Toaster theme="dark" />
              <PlayerOverlay />
              <Navbar />
              <Topbar className="max-w-[2000px] sm:pl-[78px] fixed top-0 z-20" />
              <main className="max-w-[2000px] sm:ml-[62px] mt-[62px] w-full p-4 py-7 sm:py-8 max-sm:pb-16 h-fit">
                {children}
              </main>
            </body>
          </ServerListProvider>
        </PlayerProvider>
      </WizardProvider>
    </html>
  );
}
