"use client";
import { useState } from "react";
import { Item } from "./types";

interface ProductFormProps {
  onSave: (item: Omit<Item, "_id">) => void;
  totalAtual: number;
}

export default function ProductForm({ onSave, totalAtual }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: "",
    status: "Em andamento",
    custo: "",
    dataChegada: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const quantidadeNum = Number(formData.quantidade);
    const custoNum = Number(formData.custo);

    if (!formData.nome.trim() || !quantidadeNum || !formData.dataChegada)
      return alert("Preencha todos os campos obrigatórios.");

    if (totalAtual + quantidadeNum > 300)
      return alert("❌ Limite máximo de 300 unidades no estoque atingido!");

    onSave({
      nome: formData.nome,
      quantidade: quantidadeNum,
      status: formData.status as Item["status"],
      custo: custoNum,
      dataChegada: formData.dataChegada,
      armazem: "",
    } as any);

    setFormData({
      nome: "",
      quantidade: "",
      status: "Em andamento",
      custo: "",
      dataChegada: "",
    });
  };

  return (
    <div className="bg-violet-800 text-gray-100 p-5 rounded-xl border border-violet-700 shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-3">Adicionar Produto</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome do produto"
          className="p-2 rounded bg-violet-900 border border-violet-600 text-white"
        />
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          onChange={handleChange}
          placeholder="Quantidade"
          className="p-2 rounded bg-violet-900 border border-violet-600 text-white"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="p-2 rounded bg-violet-900 border border-violet-600 text-white"
        >
          <option>Em andamento</option>
          <option>Pronto</option>
          <option>Parado</option>
        </select>
        <input
          type="number"
          name="custo"
          value={formData.custo}
          onChange={handleChange}
          placeholder="Custo (R$)"
          className="p-2 rounded bg-violet-900 border border-violet-600 text-white"
        />
        <input
          type="date"
          name="dataChegada"
          value={formData.dataChegada}
          onChange={handleChange}
          className="p-2 rounded bg-violet-900 border border-violet-600 text-white"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-violet-700 hover:bg-violet-600 px-5 py-2 rounded mt-4 transition"
      >
        Adicionar
      </button>
    </div>
  );
}
