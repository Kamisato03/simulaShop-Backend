import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import storeRoutes from "./routes/store.routes.js";
import productRoutes from "./routes/product.routes.js";
import baseProductRoutes from "./routes/baseProduct.routes.js";

const app = express();

app.use(express.json());

app.use("/api", storeRoutes);
app.use("/api", productRoutes);
app.use("/api", baseProductRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("servidor activado en http://localhost:" + PORT)
);
