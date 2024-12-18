import dbConfig from "@/middleware/db.config";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

dbConfig();

export async function POST(req: NextRequest) {
  const { user } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await User.create({
      email: user.email,
      password: hashedPassword,
    });

    if (newUser) {
      return NextResponse.json({
        message: "User created successfully",
        user: newUser,
      });
    } else {
      return NextResponse.json(
        {
          message: "User creation failed",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      {
        message: "User creation failed",
      },
      { status: 500 }
    );
  }
}
