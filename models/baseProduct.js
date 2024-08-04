import mongoose from "mongoose";
const { Schema, model } = mongoose;

const baseProductSchema = new Schema({
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
});

export const BaseProduct = model("BaseProduct", baseProductSchema);
