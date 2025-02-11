import type { Metadata } from "next";
import "./globals.css";
import Header from "@/Components/Header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CyberScout | Click with confidence",
  description:
    "CyberScout is a platform that helps you to identify phishing websites and protect your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="forest">
      <body className={`antialiased`}>
        <Header />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
