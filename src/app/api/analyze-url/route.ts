import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { url }: { url: string } = await req.json();
    const newURL = url.trim();

    const pythonScriptPath = "python/run.py";

    const { stdout, stderr } = await execPromise(
      `python "${pythonScriptPath}" "${newURL}"`
    );
    console.log(`stdout: ${stdout}`);
    return NextResponse.json(
      {
        message: "URL analysis completed successfully!",
        data: JSON.parse(stdout.trim()),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Request handling error: ${error}`);
    return NextResponse.json(
      { message: "Failed to process the request." },
      { status: 500 }
    );
  }
}
