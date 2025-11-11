import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors"; // <-- Para logs coloridos

dotenv.config();

const app = express();

// =================== MIDDLEWARES ===================
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// =================== LOG DE INÍCIO ===================
console.log("🚀 Iniciando servidor...".cyan);

// =================== CONEXÃO COM O MONGO ===================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("✅ Conectado ao MongoDB".green)
  )
  .catch((err) =>
    console.error("❌ Erro ao conectar ao MongoDB:\n".red, err)
  );

// =================== ROTA BASE ===================
app.get("/", (req, res) => {
  res.send(`
    <h1 style="color: #6A0DAD; font-family: Arial;">✅ Servidor Rodando!</h1>
    <p>API de Gestão de Estoque Online.</p>
  `);
});

// =================== SCHEMAS ===================
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

// =================== NODEMAILER ===================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// =================== ROTAS DE AUTENTICAÇÃO ===================

// REGISTER
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("⚠️ Tentativa de cadastro com email existente".yellow);
      return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    await transporter.sendMail({
      to: email,
      subject: "Cadastro realizado com sucesso",
      html: `<h3>Bem-vindo ao sistema!</h3><p>Sua conta foi criada com sucesso.</p>`,
    });

    console.log(`✅ Usuário cadastrado: ${email}`.green);
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (err) {
    console.error("❌ Erro no cadastro:".red, err);
    res.status(400).json({ error: "Erro ao cadastrar usuário" });
  }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(`🔐 Tentativa de login: ${email}`.blue);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ Usuário não encontrado".red);
    return res.status(401).json({ error: "Usuário não encontrado" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log("❌ Senha incorreta".red);
    return res.status(401).json({ error: "Senha incorreta" });
  }

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  console.log(`✅ Login bem-sucedido: ${email}`.green);
  res.json({ token });
});

// RESET EMAIL
app.post("/auth/reset", async (req, res) => {
  const { email } = req.body;
  console.log(`📩 Pedindo reset de senha para: ${email}`.yellow);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ Usuário não encontrado no reset".red);
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const link = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Redefinição de senha",
    html: `<p>Clique aqui para redefinir sua senha: <a href="${link}">${link}</a></p>`,
  });

  res.json({ message: "E-mail de recuperação enviado!" });
});

// RESET PASSWORD
app.post("/auth/reset/:token", async (req, res) => {
  const { password } = req.body;

  try {
    const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashed });

    console.log(`✅ Senha redefinida para: ${email}`.green);
    res.json({ message: "Senha atualizada com sucesso!" });

  } catch {
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
});

// =================== ROTAS DE ESTOQUE ===================

app.post("/items", async (req, res) => {
  try {
    const { nome, quantidade, armazem, dataChegada } = req.body;

    if (!nome || !quantidade || !armazem || !dataChegada) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const newItem = await Item.create({
      nome,
      quantidade,
      armazem,
      dataChegada: new Date(dataChegada),
    });

    await History.create({
      itemId: newItem._id,
      action: "criado",
      newValue: JSON.stringify(newItem),
    });

    console.log(`✅ Item criado: ${nome}`.green);
    res.status(201).json(newItem);

  } catch (err) {
    console.error("❌ Erro ao criar item".red, err);
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

app.get("/items", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

app.put("/items/:id", async (req, res) => {
  try {
    const { nome, quantidade, armazem, dataChegada } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    const oldValue = JSON.stringify(item);

    item.nome = nome ?? item.nome;
    item.quantidade = quantidade ?? item.quantidade;
    item.armazem = armazem ?? item.armazem;
    item.dataChegada = dataChegada ? new Date(dataChegada) : item.dataChegada;

    await item.save();

    await History.create({
      itemId: item._id,
      action: "editado",
      oldValue,
      newValue: JSON.stringify(item),
    });

    console.log(`✏️ Item editado: ${item.nome}`.blue);
    res.json(item);

  } catch (err) {
    console.error("❌ Erro ao editar item".red, err);
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

    console.log(`🗑️ Item removido: ${item.nome}`.red);
    res.json({ message: "Item removido" });

  } catch (err) {
    console.error("❌ Erro ao remover item".red, err);
    res.status(500).json({ error: "Erro ao remover item" });
  }
});

app.get("/items/:id/history", async (req, res) => {
  const logs = await History.find({ itemId: req.params.id }).sort({ date: -1 });
  res.json(logs);
});

// =================== SERVIDOR ===================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `✅ Servidor rodando em http://localhost:${PORT}`.green.bold
  );
});
