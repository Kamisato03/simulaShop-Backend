import { Product } from "../models/product.js";
import { PredictData } from "../models/predictData.js";
import { buildModel, trainModel } from "./model.js";
import { Store } from "../models/store.js";
import * as tf from "@tensorflow/tfjs";

export const prepareData = (historicalData) => {
  const xs = historicalData.map((record) => [record.demand, record.saleUnits]);
  const ys = historicalData.map((record) => record.saleUnits);

  // Normalización puede ser necesaria dependiendo de los datos
  return { xs, ys };
};

export const trainAndPredict = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener todos los productos
    const store = await Store.findById(id).populate({
      path: "inventory",
    });
    const products = store.inventory;
    const cycleNumber = store.currentCycle; // Puedes modificar esto según el ciclo que quieras predecir

    const predictions = [];

    for (const product of products) {
      const historicalData = product.historicalData;
      // Si no hay historicalData o si está vacío, pasar al siguiente producto
      if (!historicalData || historicalData.length === 0 || product.selectedForCycle === false) {
        continue; // Saltar al siguiente producto
      }
      // Preparar los datos
      const { xs, ys } = prepareData(historicalData);
      // Construir y entrenar el modelo
      const model = buildModel();
      await trainModel(model, xs, ys);

      // Hacer predicciones
      const lastCycleData = historicalData[historicalData.length - 1];
      const demandaPro = lastCycleData.demand;
      const unidadesVendidas = lastCycleData.saleUnits;
      // Verificación antes de usar lastCycleData
      const inputTensor = tf.tensor2d([
        [demandaPro, unidadesVendidas],
        [1, 2],
      ]);
      const predictedUnits = Math.round(
        model.predict(inputTensor).dataSync()[0]
      );

      const totalEarnings = predictedUnits * product.salePrice;
      const totalBenefits =
        predictedUnits * (product.salePrice - product.purchasePrice);

      // Guardar los resultados en PredictData
      await PredictData.create({
        cycle: cycleNumber,
        productName: product.name,
        productId: product._id,
        storeId: id,
        predictedUnits,
        totalEarnings,
        totalBenefits,
      });

      predictions.push({
        productName: product.name,
        productId: product._id,
        storeId: id,
        predictedUnits,
        totalEarnings,
        totalBenefits,
      });
    }

    return res.status(200).json({ predictions: predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
