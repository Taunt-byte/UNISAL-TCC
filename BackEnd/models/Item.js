import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true, default: 0 },
  custo: { type: Number, default: 0 }, // adiciona custo para cálculo do custoTotal
  categoria: { type: String },
  armazem: { type: String },
  dataChegada: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
