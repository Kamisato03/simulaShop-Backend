import mongoose from "mongoose";
const { Schema, model } = mongoose;

const predictDataSchema = new Schema({
  cycle: {
    type: Number,
  },
  productName: {
    type: String,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Store",
  },
  predictedUnits: {
    type: Number,
  },
  totalEarnings: {
    type: Number,
  },
  totalBenefits: {
    type: Number,
  },
});

export const PredictData = model("PredictData", predictDataSchema);
