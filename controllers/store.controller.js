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
        availableUnits: 0,
        demand: 0,
      });
    });

    const savedProducts = await Product.insertMany(storeProducts);
    savedStore.inventory.push(...savedProducts.map((product) => product._id));
    await savedStore.save();

    return res
      .status(201)
      .json({ msg: "Tienda creada con éxito", store: savedStore });
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

// Función para calcular los beneficios de un ciclo de facturación
export const calculateCycleBenefits = async (req, res) => {
  const { storeId } = req.params;
  const { cycleNumber } = req.body;

  try {
    // Buscar la tienda por ID
    const store = await Store.findById(storeId).populate("inventory");
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    let totalBenefits = 0;

    // Iterar sobre los productos seleccionados para el ciclo
    for (let product of store.inventory) {
      if (product.selectedForCycle) {
        // Calcular los beneficios para el producto
        const productBenefits = product.salePrice * product.demand;
        totalBenefits += productBenefits;

        // Restar la demanda a las unidades disponibles
        product.availableUnits -= product.demand;

        // Guardar los datos históricos del producto
        product.historicalData.push({
          cycleNumber,
          demand: product.demand,
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          saleUnits: product.demand,
        });

        // Guardar el producto actualizado
        await product.save();
      }
    }

    // Actualizar los datos del ciclo de la tienda
    store.cycleData.push({
      cycleNumber,
      lastBenefits: totalBenefits,
      totalEarnings:
        store.cycleData.reduce((sum, cycle) => sum + cycle.lastBenefits, 0) +
        totalBenefits,
    });

    // Sumar los beneficios al dinero de la tienda
    store.money += totalBenefits;

    // Guardar la tienda actualizada
    await store.save();

    return res
      .status(200)
      .json({ msg: "Beneficios del ciclo calculados y guardados", store });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor", error });
  }
};
