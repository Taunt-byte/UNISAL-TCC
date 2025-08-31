import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/** ---- ROTAS ---- **/

// Listar estoques
app.get("/stocks", async (req, res) => {
  const stocks = await prisma.stock.findMany();
  res.json(stocks);
});

// Criar estoque (se precisar)
app.post("/stocks", async (req, res) => {
  const { name } = req.body;
  const stock = await prisma.stock.create({ data: { name } });
  res.json(stock);
});

// Listar produtos de um estoque
app.get("/products", async (req, res) => {
  const { stockId } = req.query;
  const products = await prisma.product.findMany({
    where: { stockId: Number(stockId) },
    include: { movements: true },
  });
  res.json(products);
});

// Criar produto
app.post("/products", async (req, res) => {
  const { name, description, quantity, stockId } = req.body;
  const product = await prisma.product.create({
    data: { name, description, quantity, stockId: Number(stockId) },
  });
  res.json(product);
});

// Atualizar produto
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity } = req.body;
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, quantity },
  });
  res.json(product);
});

// Registrar movimentação
app.post("/products/movement", async (req, res) => {
  const { productId, type, amount } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });

  if (!product) return res.status(404).json({ error: "Produto não encontrado" });

  let newQuantity = product.quantity;
  if (type === "entrada") newQuantity += amount;
  if (type === "saida") newQuantity -= amount;

  if (newQuantity < 0) return res.status(400).json({ error: "Estoque insuficiente" });

  await prisma.product.update({
    where: { id: Number(productId) },
    data: { quantity: newQuantity },
  });

  const movement = await prisma.movement.create({
    data: { productId: Number(productId), type, amount },
  });

  res.json(movement);
});

app.listen(4000, () => {
  console.log("🚀 Servidor rodando em http://localhost:4000");
});
