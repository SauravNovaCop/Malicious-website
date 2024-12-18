import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import User from "@/models/User";
import History from "@/models/History";
import dbConfig from "@/middleware/db.config";

interface WorkerResult {
  url: string;
  data?: any;
  error?: string;
}

async function isURLWorking(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

// Function to run Python script
function analyzeURLWithPython(
  scriptPath: string,
  url: string
): Promise<WorkerResult> {
  return new Promise((resolve) => {
    const pythonProcess = spawn("python", [scriptPath, url]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const data = JSON.parse(output); // Ensure the Python script returns JSON
          resolve({ url, data });
        } catch (parseError) {
          resolve({ url, error: "Failed to parse Python script output." });
        }
      } else {
        resolve({
          url,
          error: error || `Python script exited with code ${code}.`,
        });
      }
    });
  });
}

dbConfig();

// Main handler
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

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { message: "No URLs provided." },
        { status: 400 }
      );
    }

    const pythonScriptPath = "python/run.py";

    // Process URLs concurrently with URL validation
    const results = await Promise.all(
      urls.map(async (url) => {
        const trimmedURL = url.trim();

        if (!trimmedURL) {
          return { url, error: "Invalid URL provided." };
        }

        const isWorking = await isURLWorking(trimmedURL);
        if (!isWorking) {
          return {
            url: trimmedURL,
            isWorking: false,
            message: "URL is not accessible or returned a 404 error.",
          };
        }

        const analysisResult = await analyzeURLWithPython(
          pythonScriptPath,
          trimmedURL
        );

        return {
          url: trimmedURL,
          isWorking: true,
          data: analysisResult.data,
          error: analysisResult.error,
        };
      })
    );

    console.log("Analysis results:", results);

    const historyEntries = [];
    for (const result of results) {
      const history = new History({
        url: result.url,
        isWorking: result.isWorking,
        message: result.error || undefined,
        models:
          result.isWorking && !result.error
            ? {
                randomForest: {
                  prediction: result.data.random_forest.prediction,
                  maliciousPercent: result.data.random_forest.malicious_percent,
                },
                naiveBayes: {
                  prediction: result.data.naive_bayes.prediction,
                  maliciousPercent: result.data.naive_bayes.malicious_percent,
                },
                resMLP: {
                  prediction: result.data.resmlp.prediction,
                  maliciousPercent: result.data.resmlp.malicious_percent,
                },
              }
            : undefined,
      });
      await history.save();
      historyEntries.push(history._id);
    }

    // Update user with history references
    foundUser.histroy = [...foundUser.histroy, ...historyEntries];
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
