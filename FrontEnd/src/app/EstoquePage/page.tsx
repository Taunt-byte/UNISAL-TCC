"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../components/DashBoard";
import Footer from "../components/Footer";
import { Item } from "../components/types";

export default function EstoquePage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const totalEstoque = useMemo(
    () => items.reduce((acc, i) => acc + i.quantidade, 0),
    [items]
  );

  return (
    <div className="bg-gray-100 min-h-screen text-black font-[Cambria]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-5">
        <h1 className="text-3xl font-bold text-center mb-8">
          Gestão de Estoque
        </h1>

        {/* ======== Dashboard ======== */}
        <div className="mb-12">
          <Dashboard />
        </div>

        {/* ======== AÇÕES PRINCIPAIS ======== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">

          {/* Botão 1 - Exibir Gráfico */}
          <button
            onClick={() => window.location.href = "/GraficoEstoque"}
            className="bg-blue-700 text-white py-6 rounded-xl shadow-md hover:bg-blue-800 transition font-semibold text-lg"
          >
            📊 Exibir Gráfico de Armazenamento
          </button>

          {/* Botão 2 - Exibir Tabela */}
          <button
            onClick={() => window.location.href = "/Produtos"}
            className="bg-green-600 text-white py-6 rounded-xl shadow-md hover:bg-green-700 transition font-semibold text-lg"
          >
            📋 Exibir Tabela de Produtos
          </button>

          {/* Botão 3 - Adicionar Produto */}
          <button
            onClick={() => window.location.href = "/adicionarProduto"}
            className="bg-indigo-600 text-white py-6 rounded-xl shadow-md hover:bg-indigo-700 transition font-semibold text-lg"
          >
            ➕ Adicionar Produto
          </button>

          {/* Botão 4 - Adicionar Armazém */}
          <button
            onClick={() => window.location.href = "/adicionarArmazem"}
            className="bg-orange-600 text-white py-6 rounded-xl shadow-md hover:bg-orange-700 transition font-semibold text-lg"
          >
            🏭 Adicionar Armazém
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}
