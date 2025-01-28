"use client";
import SideNavSkeleton from "@/Components/Skeletons/SideNavSkeleton";
import UserDashboardSkeleton from "@/Components/Skeletons/UserDashboard";
import { useUserContext } from "@/context/context";

const Histroy = () => {
  const { user } = useUserContext();
  if (!user)
    return (
      <SideNavSkeleton>
        <UserDashboardSkeleton />
      </SideNavSkeleton>
    );
  return (
    <>
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
                      `Saved on: ${new Date(item.createdAt).toLocaleString()}`}
                  </span>
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
                              item.models.randomForest.prediction === "phishing"
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
                            {item.models.naiveBayes.maliciousPercent.toFixed(2)}
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
    </>
  );
};

export default Histroy;
