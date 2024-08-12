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
  currentCycle: {
    type: Number,
    default: 1,
  },
  money: {
    type: Number,
    required: true,
  },
  cycleData: [
    {
      moneyInCycle: {
        type: Number,
      },
      cycleNumber: {
        type: Number,
        required: true,
      },
      lastBenefits: {
        type: Number,
        default: 0,
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
    },
  ],
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const Store = model("Store", storeSchema);
