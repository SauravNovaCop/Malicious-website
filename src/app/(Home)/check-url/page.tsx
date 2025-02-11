"use client";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const CheckURL = () => {
  const [url, setUrl] = useState("https://example.com");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalzeURL = () => {
    const urlInput = document.getElementById("urlInput") as HTMLInputElement;
    const url = urlInput.value;
    if (!url) {
      toast.error("Please enter a valid URL to analyze");
      return;
    }

    const response = axios.post("/api/analyze-url", { url });
    toast.promise(response, {
      loading: "Analyzing URL...",
      success: (res: AxiosResponse) => {
        console.log(res.data);
        const { features, random_forest, naive_bayes, resmlp } = res.data.data;
        setAnalysisResult({ features, random_forest, naive_bayes, resmlp });
        console.log(analysisResult);
        return "URL analysis completed successfully!";
      },
      error: () => {
        return "Failed to analyze the URL due to an internal error.";
      },
    });
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

  return (
    <div className="bg-base-100 text-base-content py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Check URL</h1>
        <p className="text-lg mb-4 text-center">
          You are using our platform as a guest. Please note the following:
        </p>

        <div className="bg-warning text-warning-content p-4 rounded-lg mb-6">
          <ul className="list-disc list-inside space-y-2">
            <li>
              Your browsing history and analysis reports will not be saved.
            </li>
            <li>For enhanced features, consider creating an account.</li>
            <li>
              Ensure the URL you provide does not contain sensitive or personal
              information.
            </li>
            <li>
              We do not store or share the URLs you check, ensuring your
              privacy.
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <label className="block text-lg font-medium mb-2" htmlFor="urlInput">
            Enter the URL to check:
          </label>
          <input
            id="urlInput"
            type="text"
            className="input input-bordered w-full mb-4"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="btn btn-primary w-full" onClick={handleAnalzeURL}>
            Analyze URL
          </button>
        </div>

        {analysisResult && (
          <div className="mt-8 bg-base-300 text-base-content p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Analysis Results: {url}</h3>
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
                {featureLabels.map((label, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-base-content px-4 py-2">
                      {label}
                    </td>
                    <td className="border border-base-content px-4 py-2">
                      {analysisResult.features[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold mt-6 mb-2">
              Overall Results:
            </h4>
            <div className="space-x-2 w-full flex flex-wrap justify-center space-y-4 lg:space-y-0">
              {[
                {
                  model: "Random Forest",
                  result: analysisResult.random_forest,
                },
                { model: "Naive Bayes", result: analysisResult.naive_bayes },
                { model: "ResMLP", result: analysisResult.resmlp },
              ].map(({ model, result }) => {
                return (
                  <p
                    className={`btn btn-${
                      result.prediction === "Malicious" ? "error" : "success"
                    }`}
                    key={model}
                  >
                    <strong>{model}:</strong> {result.prediction} (
                    {result.malicious_percent.toFixed(2)}%)
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckURL;
