import dbConfig from "@/middleware/db.config";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dbConfig();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function POST(req: NextRequest) {
  const { user } = await req.json();
  try {
    const userExist = await User.findOne({ email: user.email });
    if (!userExist) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const match = await bcrypt.compare(user.password, userExist.password);
    if (match) {
      const token = jwt.sign(
        { id: userExist._id, email: userExist.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const response = NextResponse.json({
        message: "Logged in successfully",
      });

      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 3600,
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Error logging in user:", err);
    return NextResponse.json({
      message: "Login failed",
    });
  }
}
