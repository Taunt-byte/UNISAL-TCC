import mongoose from "mongoose";

const movSchema = new mongoose.Schema({
  produtoId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  produto: { type: String, required: true }, // cache do nome no momento
  tipo: { type: String, enum: ["entrada", "saida"], required: true },
  quantidade: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // opcional
});

export default mongoose.models.Movimentacao || mongoose.model("Movimentacao", movSchema);
