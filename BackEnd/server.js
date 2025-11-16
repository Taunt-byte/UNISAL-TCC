import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors"; // logs coloridos

dotenv.config();

// =================== APP ===================
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

console.log("🚀 Iniciando servidor...".cyan);

// =================== CONEXÃO COM MONGO ===================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB".green))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB".red, err));

// =================== MODELS ===================
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: true },
});
const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true },
  armazem: { type: String, required: true },
  dataChegada: { type: Date, required: true },
  custo: { type: Number, default: 0 },
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
  tipo: String, // entrada ou saída
  quantidade: Number,
  data: { type: Date, default: Date.now },
});
const Movimentacao = mongoose.model("Movimentacao", movimentacaoSchema);

// =================== NODEMAILER ===================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// =================== ROTA BASE ===================
app.get("/", (req, res) => {
  res.send(`
    <h1 style="color: #6A0DAD;">✅ Servidor Rodando!</h1>
    <p>API de Gestão de Estoque Online.</p>
  `);
});

// ==================================================
// =============== AUTENTICAÇÃO =====================
// ==================================================

app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Usuário já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    await transporter.sendMail({
      to: email,
      subject: "Cadastro realizado",
      html: `<h3>Bem-vindo ao sistema!</h3>`,
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar usuário" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

app.post("/auth/reset", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const link = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Redefinição de senha",
    html: `<p>Clique aqui: <a href="${link}">${link}</a></p>`,
  });

  res.json({ message: "E-mail enviado!" });
});

app.post("/auth/reset/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);

    await User.updateOne({ email }, { password: hashed });

    res.json({ message: "Senha atualizada!" });

  } catch {
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
});

// ==================================================
// =================== ITENS ========================
// ==================================================

app.post("/items", async (req, res) => {
  try {
    const { nome, quantidade, armazem, dataChegada, custo } = req.body;

    const newItem = await Item.create({
      nome,
      quantidade,
      armazem,
      custo,
      dataChegada: new Date(dataChegada),
    });

    await History.create({
      itemId: newItem._id,
      action: "criado",
      newValue: JSON.stringify(newItem),
    });

    res.status(201).json(newItem);

  } catch (err) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

app.get("/items", async (req, res) => {
  res.json(await Item.find().sort({ createdAt: -1 }));
});

app.put("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    const oldValue = JSON.stringify(item);

    Object.assign(item, req.body);

    await item.save();

    await History.create({
      itemId: item._id,
      action: "editado",
      oldValue,
      newValue: JSON.stringify(item),
    });

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: "Erro ao editar item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    await item.deleteOne();

    await History.create({
      itemId: item._id,
      action: "removido",
      oldValue: JSON.stringify(item),
    });

    res.json({ message: "Item removido" });

  } catch (err) {
    res.status(500).json({ error: "Erro ao remover item" });
  }
});

// Histórico do item
app.get("/items/:id/history", async (req, res) => {
  const logs = await History.find({ itemId: req.params.id }).sort({ date: -1 });
  res.json(logs);
});

// ==================================================
// =============== MOVIMENTAÇÕES ====================
// ==================================================

app.post("/movimentacoes", async (req, res) => {
  try {
    const { tipo, quantidade, produtoId, data } = req.body;

    const item = await Item.findById(produtoId);
    if (!item) return res.status(404).json({ error: "Produto não encontrado" });

    const qnt = Number(quantidade);

    const novoEstoque = tipo === "entrada" ? item.quantidade + qnt : item.quantidade - qnt;

    if (novoEstoque < 0) return res.status(400).json({ error: "Estoque insuficiente" });

    item.quantidade = novoEstoque;
    await item.save();

    const mov = await Movimentacao.create({
      produtoId,
      produto: item.nome,
      tipo,
      quantidade: qnt,
      data: data ? new Date(data) : undefined,
    });

    res.json({ mov, novoEstoque });

  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar movimentação" });
  }
});

app.get("/movimentacoes", async (req, res) => {
  res.json(await Movimentacao.find().sort({ data: -1 }).limit(100));
});

// ==================================================
// ================ ESTATÍSTICAS ====================
// ==================================================

app.get("/dashboard/stats", async (req, res) => {
  try {
    const produtos = await Item.find();
    const movs = await Movimentacao.find();

    const totalProdutos = produtos.length;

    const produtosEmEstoque = produtos.reduce((sum, p) => sum + p.quantidade, 0);

    const produtosVendidos = movs
      .filter((m) => m.tipo === "saida")
      .reduce((t, m) => t + m.quantidade, 0);

    const custoTotal = produtos.reduce(
      (soma, p) => soma + (p.custo ?? 0) * p.quantidade,
      0
    );

    res.json({
      totalProdutos,
      produtosEmEstoque,
      produtosVendidos,
      custoTotal,
    });

  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar estatísticas" });
  }
});

// =================== SERVIDOR ===================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`.green.bold);
});
