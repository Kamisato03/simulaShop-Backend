import mongoose from "mongoose";
const { Schema, model } = mongoose;

const storeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cycleType: {
    type: String,
    required: true,
  },
  numberOfCycles: {
    type: Number,
    required: true,
  },
  initialBenefits: {
    type: Number,
    required: true,
  },
  lastBenefits: {
    type: Number,
    required: true,
  },
  totalEarnings: {
    type: Number,
    required: true,
  },
});

export const Store = model("Store", storeSchema);
