import { Product } from "../models/product.js";
import { Store } from "../models/store.js";

// Crea un nuevo producto y lo agrega al inventario de una tienda específica
export const createProduct = async (req, res) => {
  const {
    storeId,
    name,
    image,
    category,
    salePrice,
    purchasePrice,
    selectedForCycle,
    availableUnits,
    demandMin,
    demandMax,
  } = req.body;

  try {
    // Crear el nuevo producto
    const product = new Product({
      name,
      image,
      category,
      salePrice,
      purchasePrice,
      selectedForCycle,
      availableUnits,
      demandMin,
      demandMax,
    });

    const savedProduct = await product.save();

    // Agregar el producto al inventario de la tienda
    await Store.findByIdAndUpdate(storeId, {
      $push: { inventory: savedProduct._id },
    });

    return res
      .status(201)
      .json({ msg: "Producto creado con éxito", product: savedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene todos los productos del inventario de una tienda
export const getAllProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId).populate({
      path: "inventory",
      match: { isDeleted: false }, // Filtra productos no eliminados
    });

    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    return res.status(200).json({ products: store.inventory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Actualiza los detalles de un producto específico en el inventario de una tienda
export const updateProduct = async (req, res) => {
  const { storeId, productId } = req.params;
  const {
    name,
    image,
    category,
    salePrice,
    purchasePrice,
    selectedForCycle,
    availableUnits,
    demandMin,
    demandMax,
    isDeleted,
  } = req.body;

  try {
    let store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        image,
        category,
        salePrice,
        purchasePrice,
        selectedForCycle,
        availableUnits,
        demandMin,
        demandMax,
        isDeleted,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    store = await Store.findById(storeId).populate("inventory");
    return res
      .status(200)
      .json({ msg: "Producto actualizado con éxito", product: updatedProduct, store: store });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Marca un producto como eliminado (soft delete) en el inventario de una tienda
export const deleteProduct = async (req, res) => {
  const { storeId, productId } = req.params;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    // Marcar el producto como eliminado en la colección de productos
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true, selectedForCycle: false },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json({ msg: "Producto eliminado con éxito" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Agrega unidades disponibles a un producto y ajusta el dinero de la tienda
export const addProductUnits = async (req, res) => {
  const { storeId, productId } = req.params;
  const { additionalUnits } = req.body;

  try {
    // Buscar la tienda por ID
    const store = await Store.findById(storeId).populate("inventory");
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    // Buscar el producto en el inventario de la tienda
    const product = store.inventory.find(
      (item) => item._id.toString() === productId
    );
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado en el inventario de la tienda",
      });
    }

    // Calcular el costo total de las unidades adicionales
    const totalCost = product.purchasePrice * additionalUnits;

    // Verificar si la tienda tiene suficiente dinero
    if (store.money < totalCost) {
      return res.status(400).json({
        error: "Fondos insuficientes para comprar unidades adicionales",
      });
    }

    // Actualizar las unidades disponibles y el dinero de la tienda
    product.availableUnits += additionalUnits;
    store.money -= totalCost;

    // Guardar los cambios en la base de datos
    await product.save();
    await store.save();

    // Buscar el producto en su modelo independiente
    const productInCatalog = await Product.findById(productId);
    if (!productInCatalog) {
      return res.status(404).json({
        error: "Producto no encontrado en el catálogo de productos",
      });
    }

    // Actualizar las unidades disponibles en el modelo de producto independiente
    productInCatalog.availableUnits += additionalUnits;

    // Guardar los cambios en el modelo de producto independiente
    await productInCatalog.save();
    return res
      .status(200)
      .json({ msg: "Unidades agregadas y dinero actualizado", product, store });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};
