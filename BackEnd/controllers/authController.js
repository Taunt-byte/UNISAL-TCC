const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ message: "Dados incompletos!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "E-mail já registrado!" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nome,
      email,
      password: hashed,
    });

    return res.status(201).json({
      message: "Usuário registrado!",
      user: {
        id: newUser._id,
        nome: newUser.nome,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Senha incorreta" });

    const token = jwt.sign(
      {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
      "segredo123",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
