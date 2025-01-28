import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import Login from "@/Components/Dialogs/Login";
import { Toaster } from "react-hot-toast";
import SignUp from "@/Components/Dialogs/SignUp";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberScout | Click with confidence",
  description:
    "FaceTrack is an innovative attendance monitoring system that leverages face recognition technology to simplify and automate the process of tracking attendance. Designed for educational institutions and workplaces, this system ensures accuracy, reduces manual effort, and provides a seamless user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="forest">
      <body className={`antialiased ${roboto.className}`}>
        <Header />
        <Toaster />
        <Login />
        <SignUp />
        {children}
      </body>
    </html>
  );
}
