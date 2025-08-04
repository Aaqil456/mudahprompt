import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mudah Prompt",
  description: "bantu anda cipta prompt AI yang berkesan dengan template yang tersusun. Tak perlu lagi bergelut dengan AI yang tak faham apa yang anda mahu!",
  icons: {
    icon: '/mudahprompt.webp',
    shortcut: '/mudahprompt.webp',
    apple: '/mudahprompt.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 flex flex-col min-h-screen`}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Navbar />
        <main
          className="pt-[80px] pb-[80px] flex-1"
          style={{
            paddingTop: 'max(80px, env(safe-area-inset-top))',
            paddingBottom: 'max(80px, env(safe-area-inset-bottom))',
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
          <Analytics mode="production" />;
        </main>
        <Footer />
      </body>
    </html>
  );
}
