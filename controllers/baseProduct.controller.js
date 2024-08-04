import { BaseProduct } from "../models/baseProduct.js";

// Crea un nuevo producto base
export const createBaseProduct = async (req, res) => {
  const { name, image, category, salePrice, purchasePrice } = req.body;

  try {
    // Crear el nuevo producto base
    const baseProduct = new BaseProduct({
      name,
      image,
      category,
      salePrice,
      purchasePrice,
    });

    const savedBaseProduct = await baseProduct.save();

    return res
      .status(201)
      .json({
        msg: "Producto base creado con éxito",
        baseProduct: savedBaseProduct,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene todos los productos base
export const getAllBaseProducts = async (req, res) => {
  try {
    const baseProducts = await BaseProduct.find();
    return res.status(200).json({ baseProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene un producto base específico por ID
export const getBaseProductById = async (req, res) => {
  const { baseProductId } = req.params;

  try {
    const baseProduct = await BaseProduct.findById(baseProductId);
    if (!baseProduct) {
      return res.status(404).json({ error: "Producto base no encontrado" });
    }

    return res.status(200).json({ baseProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Actualiza los detalles de un producto base específico
export const updateBaseProduct = async (req, res) => {
  const { baseProductId } = req.params;
  const { name, image, category, salePrice, purchasePrice } = req.body;

  try {
    const updatedBaseProduct = await BaseProduct.findByIdAndUpdate(
      baseProductId,
      { name, image, category, salePrice, purchasePrice },
      { new: true }
    );

    if (!updatedBaseProduct) {
      return res.status(404).json({ error: "Producto base no encontrado" });
    }

    return res
      .status(200)
      .json({
        msg: "Producto base actualizado con éxito",
        baseProduct: updatedBaseProduct,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Elimina un producto base específico
export const deleteBaseProduct = async (req, res) => {
  const { baseProductId } = req.params;

  try {
    const deletedBaseProduct = await BaseProduct.findByIdAndDelete(
      baseProductId
    );
    if (!deletedBaseProduct) {
      return res.status(404).json({ error: "Producto base no encontrado" });
    }

    return res.status(200).json({ msg: "Producto base eliminado con éxito" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};
