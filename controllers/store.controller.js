import { Store } from "../models/store.js";

// Crea una nueva tienda
export const createStore = async (req, res) => {
  const {
    name,
    cycleType,
    numberOfCycles,
    initialBenefits,
    lastBenefits,
    totalEarnings,
  } = req.body;

  try {
    const store = new Store({
      name,
      cycleType,
      numberOfCycles,
      initialBenefits,
      lastBenefits,
      totalEarnings,
    });
    const storeUpload = await store.save();

    return res
      .status(201)
      .json({ msg: "Tienda creada con éxito", store: storeUpload });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene una lista de todas las tiendas
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    return res.status(200).json({ stores });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene una tienda por su id
export const getStore = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }
    return res.status(200).json({ store });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};
