export interface History {
  url: string;
  isWorking: boolean;
  models: {
    randomForest: {
      prediction: string;
      maliciousPercent: number;
    };
    naiveBayes: {
      prediction: string;
      maliciousPercent: number;
    };
    resMLP: {
      prediction: string;
      maliciousPercent: number;
    };
  };
  message?: string;
  createdAt: Date;
}
