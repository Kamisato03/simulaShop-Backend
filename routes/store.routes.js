import express from 'express';
import { validateStore } from '../middlewares/validatorStore.js'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { createStore, getAllStores, getStore, calculateCycleBenefits } from '../controllers/store.controller.js'; // Ajusta la ruta según tu estructura de archivos

const router = express.Router();

router.post('/store', validateStore, createStore);
router.get('/store', getAllStores);
router.get('/store/:id', getStore);
router.get("/store/:storeId/benefits", calculateCycleBenefits);

export default router;
