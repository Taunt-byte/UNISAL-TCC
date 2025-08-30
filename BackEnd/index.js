// index.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend rodando!");
});

// Rota para listar estoques
app.get("/stocks", async (req, res) => {
  const stocks = await prisma.stock.findMany({
    include: { products: true },
  });
  res.json(stocks);
});

// Rota para criar um estoque
app.post("/stocks", async (req, res) => {
  const { name } = req.body;
  const stock = await prisma.stock.create({ data: { name } });
  res.json(stock);
});

// Rota para criar produto
app.post("/products", async (req, res) => {
  const { name, description, quantity, stockId } = req.body;
  const product = await prisma.product.create({
    data: { name, description, quantity, stockId },
  });
  res.json(product);
});

// Porta do servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
