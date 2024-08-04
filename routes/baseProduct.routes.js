import express from 'express';
import {
  createBaseProduct,
  getAllBaseProducts,
  getBaseProductById,
  updateBaseProduct,
  deleteBaseProduct
} from '../controllers/baseProduct.controller.js';

const router = express.Router();

// Ruta para crear un nuevo producto base
router.post('/base-products', createBaseProduct);
// Ruta para obtener todos los productos base
router.get('/base-products', getAllBaseProducts);
// Ruta para obtener un producto base específico
router.get('/base-products/:baseProductId', getBaseProductById);
// Ruta para actualizar un producto base específico
router.put('/base-products/:baseProductId', updateBaseProduct);
// Ruta para eliminar un producto base específico
router.delete('/base-products/:baseProductId', deleteBaseProduct);

export default router;
