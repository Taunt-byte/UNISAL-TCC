import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// =================== CONEXÃO COM BANCO ===================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => console.error("❌ Erro MongoDB:", err));

// =================== SCHEMAS ===================
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: true },
});
const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});
const historySchema = new mongoose.Schema({
  itemId: String,
  action: String,
  oldValue: String,
  newValue: String,
  date: { type: Date, default: Date.now },
});
const Item = mongoose.model("Item", itemSchema);
const History = mongoose.model("History", historySchema);

// =================== EMAIL (NODEMAILER) ===================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// =================== ROTAS DE AUTENTICAÇÃO ===================
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Usuário já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    await transporter.sendMail({
      to: email,
      subject: "Cadastro realizado com sucesso",
      html: `<h3>Bem-vindo ao sistema!</h3><p>Sua conta foi criada.</p>`,
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erro ao cadastrar usuário" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
    html: `<p>Clique aqui para redefinir sua senha: <a href="${link}">${link}</a></p>`,
  });

  res.json({ message: "E-mail de recuperação enviado!" });
});

app.post("/auth/reset/:token", async (req, res) => {
  const { password } = req.body;
  try {
    const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashed });
    res.json({ message: "Senha atualizada com sucesso!" });
  } catch {
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
});

// =================== ROTAS DE ITENS ===================
app.post("/items", async (req, res) => {
  try {
    const { name } = req.body;
    const newItem = await Item.create({ name });
    await History.create({ itemId: newItem._id, action: "criado", newValue: name });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

app.get("/items", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

app.put("/items/:id", async (req, res) => {
  const { name } = req.body;
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item não encontrado" });

  const oldValue = item.name;
  item.name = name;
  await item.save();

  await History.create({
    itemId: item._id,
    action: "editado",
    oldValue,
    newValue: name,
  });

  res.json(item);
});

app.delete("/items/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item não encontrado" });

  await item.deleteOne();
  await History.create({
    itemId: item._id,
    action: "removido",
    oldValue: item.name,
  });

  res.json({ message: "Item removido" });
});

app.get("/items/:id/history", async (req, res) => {
  const logs = await History.find({ itemId: req.params.id }).sort({ date: -1 });
  res.json(logs);
});

// =================== SERVIDOR ===================
app.listen(4000, () => console.log("🚀 Backend rodando em http://localhost:4000"));
