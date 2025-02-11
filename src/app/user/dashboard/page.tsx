"use client";
import { useUserContext } from "@/context/context";
import SideNavSkeleton from "@/Components/Skeletons/SideNavSkeleton";
import UserDashboardSkeleton from "@/Components/Skeletons/UserDashboard";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { TrashIcon } from "lucide-react";

const Dashboard = () => {
  const { user } = useUserContext();
  const [urls, setUrls] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

  const handleAnalyzeURLs = () => {
    const urlArray = urls.split(",").map((url) => url.trim());
    if (urlArray.length > 4) {
      toast.error("You can only analyze up to 4 URLs at a time.");
      return;
    }
    const response = axios.post("/api/analyze-urls", {
      urls: urlArray,
      user: user?.email,
    });
    toast.promise(response, {
      loading: "Analyzing URLs...",
      success: (res: AxiosResponse) => {
        console.log(res.data.results);
        setAnalysisResults(res.data.results);
        return "URL analysis completed successfully!";
      },
      error: () => {
        return "Failed to analyze the URLs due to an internal error.";
      },
    });
  };

  const handlePrintAllResults = () => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <html>
        <head>
          <title>Analysis Results</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
            h1 { text-align: center; color: #4CAF50; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f4f4f4; }
            .badge { padding: 5px 10px; border-radius: 5px; display: inline-block; margin: 5px; }
            .badge-success { background-color: #4CAF50; color: white; }
            .badge-error { background-color: #F44336; color: white; }
            .badge-warning { background-color: #FFC107; color: black; }
          </style>
        </head>
        <body>
          <h1>Analysis Results</h1>
          ${analysisResults
            .map((result, index) => {
              if (result.error) {
                return `<h3>${urls.split(",")[index].trim()}</h3>
                        <p style="color: red;">Error: ${result.error}</p>`;
              } else {
                return `
                  <h3>${urls.split(",")[index].trim()}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${result.data.features
                        .map(
                          (feature, idx) => `
                          <tr>
                            <td>${featureLabels[idx]}</td>
                            <td>${feature}</td>
                          </tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>
                  <div>
                    <span class="badge ${
                      result.data.random_forest.prediction === "phishing"
                        ? "badge-error"
                        : "badge-success"
                    }">
                      Random Forest: ${
                        result.data.random_forest.prediction
                      } (${result.data.random_forest.malicious_percent.toFixed(
                  2
                )}%)
                    </span>
                    <span class="badge ${
                      result.data.naive_bayes.prediction === "phishing"
                        ? "badge-error"
                        : "badge-success"
                    }">
                      Naive Bayes: ${
                        result.data.naive_bayes.prediction
                      } (${result.data.naive_bayes.malicious_percent.toFixed(
                  2
                )}%)
                    </span>
                    <span class="badge ${
                      result.data.resmlp.prediction === "phishing"
                        ? "badge-error"
                        : "badge-success"
                    }">
                      ResMLP: ${
                        result.data.resmlp.prediction
                      } (${result.data.resmlp.malicious_percent.toFixed(2)}%)
                    </span>
                  </div>`;
              }
            })
            .join("")}
        </body>
      </html>
    `;

    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const featureLabels = [
    "Using IP",
    "Long URL",
    "Short URL",
    "Symbol @",
    "Redirecting //",
    "Prefix Suffix -",
    "SubDomains",
    "HTTPS",
    "Domain Reg Length",
    "Favicon",
    "Non-Std Port",
    "HTTPS Domain URL",
    "Request URL",
    "Anchor URL",
    "Links In Script Tags",
    "Server Form Handler",
    "Info Email",
    "Abnormal URL",
    "Website Forwarding",
    "Status Bar Customization",
    "Disable Right Click",
    "Using Popup Window",
    "Iframe Redirection",
    "Age of Domain",
    "DNS Recording",
    "Website Traffic",
    "PageRank",
    "Google Index",
    "Links Pointing To Page",
    "Stats Report",
  ];

  if (!user)
    return (
      <SideNavSkeleton>
        <UserDashboardSkeleton />
      </SideNavSkeleton>
    );
  const handleDeleteURL = (id: string) => {
    const response = axios.delete(`/api/delete-url?id=${id}`);
    toast.promise(response, {
      loading: "Deleting URL...",
      success: () => {
        return "URL deleted successfully!";
      },
      error: () => {
        return "Failed to delete the URL due to an internal error.";
      },
    });
  };

  return (
    <div className="bg-base-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Your Dashboard</h1>
        <p className="text-lg text-base-content text-center mb-8">
          Welcome, {user.email || "User"}! Here are your saved links:
        </p>

        {user.histroy.length !== 0 ? (
          <div className="bg-base-200 text-base-content p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">
              Saved Links
            </h2>
            <ul className="divide-y divide-base-content/80">
              {user.histroy.map((item, index) => (
                <li
                  key={index}
                  className="py-6 px-4 rounded-lg bg-base-100 shadow-md mb-4"
                >
                  <div className="flex justify-between items-center">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-secondary hover:underline"
                    >
                      {item.url}
                    </a>
                    <span className="text-base text-base-content/60">
                      {item.createdAt &&
                        `Saved on: ${new Date(
                          item.createdAt
                        ).toLocaleString()}`}
                    </span>
                    <button
                      className="btn btn-error"
                      title="Delete URL"
                      onClick={() => handleDeleteURL(item._id)}
                    >
                      <TrashIcon size={24} />
                    </button>
                  </div>
                  <div className="mt-4">
                    <p
                      className={`text-base font-medium ${
                        item.isWorking ? "text-success" : "text-error"
                      }`}
                    >
                      {item.isWorking
                        ? "URL is accessible"
                        : "URL is not accessible or returned an error"}
                    </p>

                    {/* Display Error Message if present */}
                    {item.message && (
                      <p className="text-base text-warning mt-2">
                        {item.message}
                      </p>
                    )}

                    {/* Model Predictions */}
                    {item.models ? (
                      <>
                        <h3 className="text-lg font-bold text-primary mt-4">
                          Model Predictions
                        </h3>
                        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <li className="p-4 border rounded-md bg-base-300 text-center">
                            <h4 className="font-semibold text-lg text-secondary">
                              Random Forest
                            </h4>
                            <p
                              className={`mt-2 text-xl font-bold ${
                                item.models.randomForest.prediction ===
                                "phishing"
                                  ? "text-error"
                                  : "text-success"
                              }`}
                            >
                              {item.models.randomForest.prediction}
                            </p>
                            <p className="text-base text-base-content/60 capitalize">
                              {item.models.randomForest.maliciousPercent.toFixed(
                                2
                              )}
                              % malicious
                            </p>
                          </li>
                          <li className="p-4 border rounded-md bg-base-300 text-center">
                            <h4 className="font-semibold text-lg text-secondary">
                              Naive Bayes
                            </h4>
                            <p
                              className={`mt-2 text-xl font-bold ${
                                item.models.naiveBayes.prediction === "phishing"
                                  ? "text-error"
                                  : "text-success"
                              }`}
                            >
                              {item.models.naiveBayes.prediction}
                            </p>
                            <p className="text-base text-base-content/60 capitalize">
                              {item.models.naiveBayes.maliciousPercent.toFixed(
                                2
                              )}
                              % malicious
                            </p>
                          </li>
                          <li className="p-4 border rounded-md bg-base-300 text-center">
                            <h4 className="font-semibold text-lg text-secondary">
                              ResMLP
                            </h4>
                            <p
                              className={`mt-2 text-xl font-bold ${
                                item.models.resMLP.prediction === "phishing"
                                  ? "text-error"
                                  : "text-success"
                              }`}
                            >
                              {item.models.resMLP.prediction}
                            </p>
                            <p className="text-base text-base-content/60 capitalize">
                              {item.models.resMLP.maliciousPercent.toFixed(2)}%
                              malicious
                            </p>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <p className="text-base text-gray-600 mt-4">
                        No prediction data available for this URL.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-xl font-medium text-base-content/80">
              No saved links yet.
            </p>
            <p className="text-base text-base-content/60">
              Start analyzing URLs to see them here.
            </p>
          </div>
        )}

        <div className="mt-8">
          <label className="block text-lg font-medium mb-2">
            Enter up to 4 URLs (comma-separated):
          </label>
          <input
            type="text"
            className="input input-bordered w-full mb-4"
            placeholder="e.g., https://example1.com, https://example2.com"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
          <button
            className="btn btn-primary w-full"
            onClick={handleAnalyzeURLs}
          >
            Analyze URLs
          </button>

          {analysisResults.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-lg text-base-content/80">
                No analysis results available.
              </p>
              <p className="text-base text-base-content/60">
                Please check the URLs or try again later.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <button
                className="btn btn-secondary mb-4 w-full"
                onClick={handlePrintAllResults}
              >
                Print All Results
              </button>
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-base-300 text-base-content p-6 rounded-lg mb-6 shadow-md"
                >
                  <h3 className="text-xl font-bold mb-4">
                    Analysis Results:
                    <span className="text-primary">
                      {urls.split(",")[index].trim()}
                    </span>
                  </h3>

                  {result.error ? (
                    <p className="text-error text-lg font-semibold">
                      {result.error}
                    </p>
                  ) : (
                    <>
                      {result.data.features.length > 0 ? (
                        <table className="table-auto w-full border-collapse border border-base-content/80">
                          <thead>
                            <tr className="bg-accent text-accent-content">
                              <th className="border border-accent-content px-4 py-2">
                                Feature
                              </th>
                              <th className="border border-accent-content px-4 py-2">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.data.features.map((feature, idx) => (
                              <tr key={idx} className="text-center">
                                <td className="border border-base-content px-4 py-2">
                                  {featureLabels[idx]}
                                </td>
                                <td className="border border-base-content px-4 py-2">
                                  {feature}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-lg text-warning">
                          No detailed features were returned for this URL.
                        </p>
                      )}

                      <h4 className="text-2xl font-semibold mt-6 mb-2">
                        Overall Results:
                      </h4>
                      <div className="space-x-2 w-full flex flex-wrap justify-center">
                        {[
                          {
                            model: "Random Forest",
                            result: result.data.random_forest,
                          },
                          {
                            model: "Naive Bayes",
                            result: result.data.naive_bayes,
                          },
                          { model: "ResMLP", result: result.data.resmlp },
                        ].map(({ model, result }) => {
                          return (
                            <p
                              className={`btn btn-${
                                result.prediction === "Malicious"
                                  ? "error"
                                  : "success"
                              }`}
                              key={model}
                            >
                              <strong>{model}:</strong> {result.prediction} (
                              {result.malicious_percent.toFixed(2)}%)
                            </p>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
