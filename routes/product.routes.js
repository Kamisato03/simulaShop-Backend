import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProductUnits,
} from "../controllers/product.controller.js";

const router = express.Router();

// Ruta para crear un nuevo producto y agregarlo al inventario de una tienda
router.post("/stores/:storeId/products", createProduct);
// Ruta para obtener todos los productos del inventario de una tienda
router.get("/stores/:storeId/products", getAllProducts);
// Ruta para actualizar los detalles de un producto específico
router.put("/stores/:storeId/products/:productId", updateProduct);
// Ruta para marcar un producto como eliminado (soft delete)
router.patch("/stores/:storeId/products/:productId", deleteProduct);
// Ruta para agregar unidades a un producto y actualizar el dinero de la tienda
router.put("/stores/:storeId/products/:productId/add-units", addProductUnits);

export default router;
