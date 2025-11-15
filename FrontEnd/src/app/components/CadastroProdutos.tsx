"use client";

import { useState } from "react";
import { Item } from "./types";

interface ProductFormProps {
  onSave: (item: Omit<Item, "_id">) => void;
  totalAtual: number;
}

export default function CadastroProdutos({ onSave, totalAtual }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: "",
    custo: "",
    categoria: "",
    armazem: "",
    dataChegada: "",
    status: "Em andamento",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  const quantidadeNum = Number(formData.quantidade);
  const custoNum = Number(formData.custo);

  if (!formData.nome.trim()) return alert("O nome do produto é obrigatório.");
  if (!quantidadeNum || quantidadeNum <= 0)
    return alert("A quantidade deve ser maior que zero.");
  if (!formData.dataChegada) return alert("A data de chegada é obrigatória.");

  if (totalAtual + quantidadeNum > 300)
    return alert("❌ Limite máximo de 300 unidades no estoque atingido!");

  // 🔥 Enviar para o backend
  try {
    const response = await fetch("http://localhost:4000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: formData.nome,
        quantidade: quantidadeNum,
        armazem: formData.armazem,
        dataChegada: formData.dataChegada,
      }),
    });

    if (!response.ok) throw new Error("Erro ao salvar no servidor");

    alert("Produto adicionado com sucesso!");

  } catch (err) {
    console.error(err);
    alert("Erro ao salvar no servidor.");
  }

  setFormData({
    nome: "",
    quantidade: "",
    custo: "",
    categoria: "",
    armazem: "",
    dataChegada: "",
    status: "Em andamento",
  });
};


  return (
    <div className="bg-violet-800 text-white p-6 rounded-xl border border-violet-700 shadow-lg mb-8 font-[Cambria]">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Produtos</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Nome */}
        <div>
          <label className="text-sm opacity-80">Nome do Produto</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
            placeholder="Ex: Parafuso 10mm"
          />
        </div>

        {/* Quantidade */}
        <div>
          <label className="text-sm opacity-80">Quantidade</label>
          <input
            type="number"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
            placeholder="Ex: 50"
          />
        </div>

        {/* Custo */}
        <div>
          <label className="text-sm opacity-80">Custo (R$)</label>
          <input
            type="number"
            name="custo"
            value={formData.custo}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
            placeholder="Ex: 12.50"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="text-sm opacity-80">Categoria</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
            placeholder="Ex: Materiais, Eletrônicos..."
          />
        </div>

        {/* Armazém */}
        <div>
          <label className="text-sm opacity-80">Armazém / Local</label>
          <input
            type="text"
            name="armazem"
            value={formData.armazem}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
            placeholder="Ex: A-32, Prateleira 2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm opacity-80">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
          >
            <option>Em andamento</option>
            <option>Pronto</option>
            <option>Parado</option>
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="text-sm opacity-80">Data de Chegada</label>
          <input
            type="date"
            name="dataChegada"
            value={formData.dataChegada}
            onChange={handleChange}
            className="w-full p-2 rounded bg-violet-900 border border-violet-600 text-white"
          />
        </div>

      </div>

      <button
        onClick={handleSubmit}
        className="bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-lg mt-6 transition font-semibold shadow"
      >
        Adicionar Produto
      </button>
    </div>
  );
}
