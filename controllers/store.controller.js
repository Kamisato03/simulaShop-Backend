import { Store } from "../models/store.js";
import { BaseProduct } from "../models/baseProduct.js";
import { Product } from "../models/product.js";

// Crea una nueva tienda
export const createStore = async (req, res) => {
  const { name, cycleType, numberOfCycles, money } = req.body;

  try {
    // Crear una nueva tienda
    const store = new Store({
      name,
      cycleType,
      numberOfCycles,
      money,
    });
    const savedStore = await store.save();

    // Obtener los productos base
    const baseProducts = await BaseProduct.find();

    // Crear y agregar los productos base al inventario de la tienda
    const storeProducts = baseProducts.map((baseProduct) => {
      return new Product({
        name: baseProduct.name,
        image: baseProduct.image,
        category: baseProduct.category,
        salePrice: baseProduct.salePrice,
        purchasePrice: baseProduct.purchasePrice,
        availableUnits: 15,
        demandMin: 10,
        demandMax: 20,
      });
    });

    const savedProducts = await Product.insertMany(storeProducts);
    savedStore.inventory.push(...savedProducts.map((product) => product._id));
    await savedStore.save();

    return res
      .status(201)
      .json({ msg: "Tienda creada con éxito", store: savedStore });
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene una lista de todas las tiendas
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("inventory");
    return res.status(200).json({ stores });
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Obtiene una tienda por su id
export const getStore = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findById(id).populate("inventory");
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }
    return res.status(200).json({ store });
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor", error });
  }
};

// Función para calcular los beneficios de un ciclo de facturación
export const calculateCycleBenefits = async (req, res) => {
  const { storeId } = req.params;

  try {
    // Buscar la tienda por ID
    let store = await Store.findById(storeId).populate("inventory");
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    let totalBenefits = 0;
    const cicloActual = store.currentCycle;

    // Iterar sobre los productos seleccionados para el ciclo
    for (let product of store.inventory) {
      if (product.selectedForCycle) {
        const demand =
          Math.floor(
            Math.random() * (product.demandMax - product.demandMin + 1)
          ) + product.demandMin;
        if (demand <= product.availableUnits) {
          // Calcular los beneficios para el producto cuando la demanda es menor a las unidades disponibles
          const productBenefits = product.salePrice * demand;
          totalBenefits += productBenefits;

          // Restar la demanda a las unidades disponibles
          product.availableUnits -= demand;

          // Guardar los datos históricos del producto
          product.historicalData.push({
            cycleNumber: store.currentCycle,
            demandMin: product.demandMin,
            demandMax: product.demandMax,
            demand: demand,
            purchasePrice: product.purchasePrice,
            salePrice: product.salePrice,
            saleUnits: demand,
          });
        } else {
          // Calcular los beneficios para el producto cuando la demanda supera las unidades disponibles
          const productBenefits = product.salePrice * product.availableUnits;
          totalBenefits += productBenefits;

          // Guardar los datos históricos del producto
          product.historicalData.push({
            cycleNumber: store.currentCycle,
            demandMin: product.demandMin,
            demandMax: product.demandMax,
            demand: demand,
            purchasePrice: product.purchasePrice,
            salePrice: product.salePrice,
            saleUnits: product.availableUnits,
          });

          // Restar las unidades que se vendieron a las unidades disponibles
          product.availableUnits -= product.availableUnits;
        }
        // Guardar el producto actualizado
        if (product.availableUnits == 0) {
          product.selectedForCycle = false;
        }
        await product.save();
      }
    }

    // Actualizar los datos del ciclo de la tienda
    store.cycleData.push({
      cycleNumber: store.currentCycle,
      lastBenefits: totalBenefits,
      totalEarnings:
        store.cycleData.reduce((sum, cycle) => sum + cycle.lastBenefits, 0) +
        totalBenefits,
    });

    // Sumar los beneficios al dinero de la tienda
    store.money += totalBenefits;
    store.currentCycle += 1;

    // Guardar la tienda actualizada
    await store.save();
    store = await Store.findById(storeId).populate("inventory");

    return res.status(200).json({
      msg: `Beneficios del ciclo ${cicloActual} calculados y guardados`,
      store,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor", error });
  }
};
