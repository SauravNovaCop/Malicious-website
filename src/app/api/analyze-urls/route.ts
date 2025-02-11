import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import History from "@/models/History";
import dbConfig from "@/middleware/db.config";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function isURLWorking(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { urls, user }: { urls: string[]; user: string } = await req.json();

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const foundUser = await User.findOne({ email: user });
    if (!foundUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (!Array.isArray(foundUser.history)) {
      foundUser.history = [];
    }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { message: "No URLs provided." },
        { status: 400 }
      );
    }
    if (urls.length > 10) {
      return NextResponse.json(
        { message: "Maximum of 10 URLs allowed." },
        { status: 400 }
      );
    }

    const pythonScriptPath = "python/run.py";
    const results: any[] = [];
    const historyEntries: any[] = [];

    for (const url of urls) {
      const trimmedURL = url.trim();
      if (!trimmedURL) {
        results.push({ url, error: "Invalid URL provided." });
        continue;
      }

      const isWorking = await isURLWorking(trimmedURL);
      if (!isWorking) {
        results.push({
          url: trimmedURL,
          isWorking: false,
          message: "URL is not accessible or returned a 404 error.",
        });
        continue;
      }

      try {
        const { stdout, stderr } = await execPromise(
          `py -3.12 "${pythonScriptPath}" "${trimmedURL}"`
        );

        if (stderr) {
          console.error(`Python script stderr for ${trimmedURL}:`, stderr);
        }

        const analysisResult = JSON.parse(stdout.trim());

        const history = new History({
          url: trimmedURL,
          isWorking: true,
          models: {
            randomForest: {
              prediction: analysisResult.random_forest.prediction,
              maliciousPercent: analysisResult.random_forest.malicious_percent,
            },
            naiveBayes: {
              prediction: analysisResult.naive_bayes.prediction,
              maliciousPercent: analysisResult.naive_bayes.malicious_percent,
            },
            resMLP: {
              prediction: analysisResult.resmlp.prediction,
              maliciousPercent: analysisResult.resmlp.malicious_percent,
            },
          },
        });
        await history.save();
        historyEntries.push(history._id);

        results.push({
          url: trimmedURL,
          isWorking: true,
          data: analysisResult,
        });
      } catch (error) {
        console.error(`Error processing URL ${trimmedURL}:`, error);
        results.push({
          url: trimmedURL,
          isWorking: true,
          error: "Failed to analyze this URL.",
        });
      }
    }
    foundUser.histroy.push(...historyEntries);
    await foundUser.save();

    return NextResponse.json(
      { message: "URL analysis completed successfully!", results },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Request handling error: ${error}`);
    return NextResponse.json(
      { message: "Failed to process the request.", error: error.toString() },
      { status: 500 }
    );
  }
}
