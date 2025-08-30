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
    <html lang="en">
      <WizardProvider>
        <PlayerProvider>
          <ServerListProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-screen h-[100dvh] overflow-hidden flex justify-center`}
            >
              <Toaster theme="dark" />
              <PlayerOverlay />
              <Navbar />
              <div className="sm:ml-[62px] gap-4 grid grow grid-rows-[auto_1fr] w-full py-3 sm:py-4 overflow-hidden max-w-[2000px]">
                <Topbar />
                <main className="relative overflow-y-auto overflow-x-hidden p-4 max-sm:pb-16">
                  {children}
                </main>
              </div>
            </body>
          </ServerListProvider>
        </PlayerProvider>
      </WizardProvider>
    </html>
  );
}
