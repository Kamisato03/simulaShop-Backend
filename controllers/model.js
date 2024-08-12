import * as tf from "@tensorflow/tfjs";

// Construir el modelo
export const buildModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 64, activation: "relu", inputShape: [2] })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });

  return model;
};

// Entrenar el modelo
export const trainModel = async (model, xs, ys) => {
  const xsTensor = tf.tensor2d(xs, [xs.length, 2]);
  const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

  await model.fit(xsTensor, ysTensor, {
    epochs: 50,
    batchSize: 32,
    shuffle: true,
  });

  // Liberar memoria de los tensores
  xsTensor.dispose();
  ysTensor.dispose();
};
