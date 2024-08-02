import express from 'express';
import { validateStore } from './middlewares/storeValidator.js'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { createStore, getAllStores, getStore } from './controllers/storeController.js'; // Ajusta la ruta según tu estructura de archivos

const router = express.Router();

router.post('/store', validateStore, createStore);
router.get('/store', getAllStores);
router.get('/store/:id', getStore);

export default router;
