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

// 🔹 Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => console.error("❌ Erro MongoDB:", err));

// 🔹 Schema de usuário
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

// 🔹 Nodemailer genérico
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Cadastro de usuário
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Preencha todos os campos" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuário já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    // Token de verificação
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const link = `http://localhost:3000/verify?token=${token}`;

    // Envio de e-mail de verificação
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirme seu cadastro",
      html: `<p>Clique para confirmar seu cadastro: <a href="${link}">${link}</a></p>`,
    });

    res.status(201).json({ message: "Usuário cadastrado! Verifique seu e-mail." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// 🔹 Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Preencha todos os campos" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });
    if (!user.verified) return res.status(403).json({ error: "Verifique seu e-mail" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// 🔹 Verificação de e-mail
app.get("/auth/verify", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Token inválido");

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await User.updateOne({ email }, { verified: true });
    res.send("✅ E-mail verificado com sucesso!");
  } catch {
    res.status(400).send("Token inválido ou expirado.");
  }
});

// 🔹 Recuperar senha
app.post("/auth/reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const link = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperação de senha",
    html: `<p>Clique aqui para redefinir sua senha: <a href="${link}">${link}</a></p>`,
  });

  res.json({ message: "E-mail de recuperação enviado!" });
});

// 🔹 Teste rota raiz
app.get("/", (req, res) => res.send("Backend rodando!"));

app.listen(4000, () => console.log("🚀 Servidor rodando em http://localhost:4000"));
// ⚠️ Apenas para admin/teste, não mostrar senhas
app.get("/auth/users", async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, verified: 1, _id: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});
