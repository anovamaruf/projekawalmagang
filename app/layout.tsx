import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "./provider";
import UserButton from "./UserButton";
import LoadingOverlay from "./LoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fynoo Outdoor Rent",
  description: "Penyewaan Alat Outdoor Terlengkap, Termurah dan Terpercaya",
  icons: {
    icon: '/logo.svg', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <LoadingOverlay />
        <NextAuthSessionProvider>
          <header className="flex justify-between items-center p-4 border-b border-gray-800">
            <span className="font-bold text-lg">fynoo Outdoor Rent</span>
            <UserButton />
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}