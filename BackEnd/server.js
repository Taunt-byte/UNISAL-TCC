// ================= SERVER COMPLETO, ARRUMADO E FUNCIONAL =================

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import fs from "fs";
import path from "path";

dotenv.config();

// =================== APP ===================
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

console.log("🚀 Iniciando servidor...".cyan);

// =================== MONGO ===================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB".green))
  .catch((err) =>
    console.error("❌ Erro ao conectar ao MongoDB".red, err.message)
  );

// =================== MODELS ===================
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: true },
});
const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
  nome: String,
  quantidade: Number,
  armazem: String,
  dataChegada: Date,
  custo: Number,
  createdAt: { type: Date, default: Date.now },
});
const Item = mongoose.model("Item", itemSchema);

const historySchema = new mongoose.Schema({
  itemId: String,
  action: String,
  oldValue: String,
  newValue: String,
  date: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

const movimentacaoSchema = new mongoose.Schema({
  produtoId: String,
  produto: String,
  tipo: String,
  quantidade: Number,
  data: { type: Date, default: Date.now },
});
const Movimentacao = mongoose.model("Movimentacao", movimentacaoSchema);

const armazemSchema = new mongoose.Schema({
  nome: { type: String, unique: true },
  localizacao: String,
  criadoEm: { type: Date, default: Date.now },
});
armazemSchema.index({ nome: 1 }, { unique: true });
const Armazem = mongoose.model("Armazem", armazemSchema);

// =================== EMAIL ===================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// =================== LOG DE MOVIMENTAÇÕES ===================
const logFile = path.join(process.cwd(), "movimentacoes.json");
if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, "[]");

function registrarMovimentacao(tipo, descricao) {
  const logs = JSON.parse(fs.readFileSync(logFile));
  logs.push({
    tipo,
    descricao,
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

app.get("/movimentacoes-logs", (req, res) => {
  const logs = JSON.parse(fs.readFileSync(logFile));
  res.json(logs);
});

// =================== ROTA BASE ===================
app.get("/", (req, res) => {
  res.send(`
    <h1 style="color: #6A0DAD;">Servidor Rodando!</h1>
    <p>API de Gestão de Estoque.</p>
  `);
});

// ==================================================
// ================= AUTENTICAÇÃO ====================
// ==================================================

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email e senha são obrigatórios" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Usuário já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    transporter
      .sendMail({
        to: email,
        subject: "Cadastro realizado",
        html: "<h3>Bem-vindo ao sistema!</h3>",
      })
      .catch(() => {});

    res.status(201).json({ message: "Usuário criado", id: user._id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
});

// ==================================================
// ===================== ITENS =======================
// ==================================================

app.post("/items", async (req, res) => {
  try {
    const item = await Item.create(req.body);

    await History.create({
      itemId: item._id,
      action: "criado",
      newValue: JSON.stringify(item),
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

app.get("/items", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

// EDITAR ITEM
app.put("/items/:id", async (req, res) => {
  try {
    const old = await Item.findById(req.params.id);
    if (!old) return res.status(404).json({ error: "Item não encontrado" });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    await History.create({
      itemId: updated._id,
      action: "editado",
      oldValue: JSON.stringify(old),
      newValue: JSON.stringify(updated),
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erro ao editar item" });
  }
});

// REMOVER ITEM
app.delete("/items/:id", async (req, res) => {
  try {
    const del = await Item.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "Item não encontrado" });

    await History.create({
      itemId: req.params.id,
      action: "removido",
      oldValue: JSON.stringify(del),
    });

    res.json({ message: "Item removido" });
  } catch {
    res.status(500).json({ error: "Erro ao remover item" });
  }
});

// ==================================================
// ================= MOVIMENTAÇÕES ==================
// ==================================================

app.post("/movimentacoes", async (req, res) => {
  try {
    const { tipo, quantidade, produtoId } = req.body;

    const item = await Item.findById(produtoId);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    const q = Number(quantidade);
    const novoEstoque = tipo === "entrada" ? item.quantidade + q : item.quantidade - q;

    if (novoEstoque < 0)
      return res.status(400).json({ error: "Estoque insuficiente" });

    item.quantidade = novoEstoque;
    await item.save();

    const mov = await Movimentacao.create({
      produtoId,
      produto: item.nome,
      tipo,
      quantidade: q,
    });

    registrarMovimentacao(tipo, `${tipo} de ${q} unidades no item ${item.nome}`);

    res.json({ mov, novoEstoque });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar movimentação" });
  }
});

app.get("/movimentacoes", async (req, res) => {
  const movs = await Movimentacao.find().sort({ data: -1 }).limit(100);
  res.json(movs);
});

// ==================================================
// =================== ARMAZÉNS =====================
// ==================================================
app.post("/armazens", async (req, res) => {
  try {
    const novo = await Armazem.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar armazém" });
  }
});

app.get("/armazens", async (req, res) => {
  const list = await Armazem.find();
  res.json(list);
});

// ==================================================
// =================== STATS ========================
// ==================================================
app.get("/dashboard/stats", async (req, res) => {
  const produtos = await Item.find();
  const movs = await Movimentacao.find();

  const totalProdutos = produtos.length;
  const produtosEmEstoque = produtos.reduce((s, p) => s + p.quantidade, 0);
  const produtosVendidos = movs
    .filter((m) => m.tipo === "saida")
    .reduce((s, m) => s + m.quantidade, 0);
  const custoTotal = produtos.reduce(
    (s, p) => s + (p.custo ?? 0) * p.quantidade,
    0
  );

  res.json({
    totalProdutos,
    produtosEmEstoque,
    produtosVendidos,
    custoTotal,
  });
});
// ==================================================
// ================== POPULAR BANCO =================
// ==================================================
async function popularBancoEletronicos() {
  const armazens = await Armazem.find();
  if (armazens.length === 0) {
    console.log("⚠ Nenhum armazém encontrado.");
    return;
  }

  const nomes = [
    "Mouse Gamer", "Teclado Mecânico", "Monitor 24\"", "SSD 1TB",
    "HD 2TB", "Fonte 650W", "Placa-Mãe B450", "RTX 3060", "Gabinete RGB"
  ];

  const logsParaInserir = [];
  const itemsParaInserir = [];

  for (let i = 0; i < 300; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const quantidade = Math.floor(Math.random() * 40) + 1;
    const custo = Math.floor(Math.random() * 800) + 100;
    const armazem = armazens[Math.floor(Math.random() * armazens.length)].nome;

    const novoItem = {
      nome,
      quantidade,
      armazem,
      custo,
      dataChegada: new Date(),
    };

    itemsParaInserir.push(novoItem);

    // 🔥 Registrar movimentação
    logsParaInserir.push({
      tipo: "ITEM_ADICIONADO",
      descricao: `${quantidade} unidades de ${nome} foram adicionadas ao armazém ${armazem}.`,
      timestamp: new Date(),
    });
  }

  // Inserir itens
  await Item.insertMany(itemsParaInserir);

  // Inserir logs
  await Movimentacao.create(logsParaInserir);

  console.log(`🌟 Banco populado com ${itemsParaInserir.length} itens e logs salvos!`);
}

// Rode 1 vez
popularBancoEletronicos();

// =================== SERVIDOR ===================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`.green.bold)
);
