import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const verifyToken = async (authToken: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/verifytoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: authToken }),
    });

    if (!response.ok) throw new Error("Token verification failed");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Response was not JSON");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicPath = ["/"].includes(pathname);

  const token = req.cookies.get("authToken")?.value || "";
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublicPath) {
    console.log("Not logged in, redirecting to public login page");
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isLoggedIn) {
    const user = await verifyToken(token);
    if (!user.data) {
      console.log("Token verification failed, redirecting to login");
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    if (isLoggedIn) {
      const dashboardPath = `/user/dashboard`;

      if (isPublicPath) {
        return NextResponse.redirect(
          new URL(dashboardPath, req.nextUrl.origin)
        );
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*"],
};
