import type { Metadata } from "next";
import localFont from "next/font/local";
import { Backdrop } from "@/components/Backdrop";
import "./globals.css";

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans.woff2",
  variable: "--font-sans",
  weight: "300 800",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MotionGrade",
  description: "Computer-vision coaching that grades every rep of your lift.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${geistMono.variable} antialiased`}>
        <Backdrop />
        {children}
      </body>
    </html>
  );
}
