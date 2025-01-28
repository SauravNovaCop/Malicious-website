"use client";
import { Roboto } from "next/font/google";
import "./../(Home)/globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider, useUserContext } from "@/context/context";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
import SideNav from "./SideNav";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AppContent>{children}</AppContent>
    </UserProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const response = await axios.get("/api/user/verifyUser");
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to verify token:", error);
        setUser(null);
        router.push("/");
      }
    };
    getUserFromToken();
  }, [router, setUser]);
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>CyberScout | Click with confidence</title>
      </head>
      <body className={`antialiased ${roboto.className}`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
}
