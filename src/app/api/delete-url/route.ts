import History from "@/models/History";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Missing history id" },
      { status: 400 }
    );
  }
  try {
    await History.findByIdAndDelete(id);
    return NextResponse.json({ message: "History Link Deleted successfully" });
  } catch (error) {
    console.error(`Request handling error: ${error}`);
    return NextResponse.json(
      { message: "Failed to process the request." },
      { status: 500 }
    );
  }
}
