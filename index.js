import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cors from "cors";
import storeRoutes from "./routes/store.routes.js";
import productRoutes from "./routes/product.routes.js";
import baseProductRoutes from "./routes/baseProduct.routes.js";

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("Error de CORS origin: " + origin + " No autorizado!");
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", storeRoutes);
app.use("/api", productRoutes);
app.use("/api", baseProductRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("servidor activado en http://localhost:" + PORT)
);
