import express from "express";
import cors from "cors";
import stockRoutes from "./routes/stockRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/stocks", stockRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
