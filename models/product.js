import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  selectedForCycle: {
    type: Boolean,
    default: false,
  },
  availableUnits: {
    type: Number,
    required: true,
  },
  demand: {
    type: Number,
    required: true,
  },
  historicalData: [
    {
      cycleNumber: {
        type: Number,
      },
      demand: {
        type: Number,
      },
      purchasePrice: {
        type: Number,
      },
      salePrice: {
        type: Number,
      },
      saleUnits: {
        type: Number,
      },
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Product = model("Product", productSchema);
