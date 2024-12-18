import mongoose from "mongoose";
import { Schema } from "mongoose";

const HistoryModel = new Schema({
  url: {
    type: String,
    required: true,
  },
  isWorking: {
    type: Boolean,
    required: true,
  },
  models: {
    randomForest: {
      prediction: { type: String },
      maliciousPercent: { type: Number },
    },
    naiveBayes: {
      prediction: { type: String },
      maliciousPercent: { type: Number },
    },
    resMLP: {
      prediction: { type: String },
      maliciousPercent: { type: Number },
    },
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const History =
  mongoose.models.History || mongoose.model("History", HistoryModel);

export default History;
