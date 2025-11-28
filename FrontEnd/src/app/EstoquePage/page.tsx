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
        <h1 className="text-3xl font-bold text-center mb-10">
          Gestão de Estoque
        </h1>

        {/* ======== AÇÕES PRINCIPAIS ======== */}
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-4 
          gap-3 
          mb-16
        ">

          {/* Botões com espaçamento reduzido e design unificado */}
          <button
            onClick={() => (window.location.href = "/GraficoEstoque")}
            className="bg-blue-700 text-white py-5 rounded-xl shadow-lg hover:bg-blue-800 
                       transition font-semibold text-lg h-full"
          >
            📊 Exibir Gráfico de Armazenamento
          </button>

          <button
            onClick={() => (window.location.href = "/Produtos")}
            className="bg-green-600 text-white py-5 rounded-xl shadow-lg hover:bg-green-700 
                       transition font-semibold text-lg h-full"
          >
            📋 Exibir Tabela de Produtos
          </button>

          <button
            onClick={() => (window.location.href = "/adicionarProduto")}
            className="bg-indigo-600 text-white py-5 rounded-xl shadow-lg hover:bg-indigo-700 
                       transition font-semibold text-lg h-full"
          >
            ➕ Adicionar Produto
          </button>

          <button
            onClick={() => (window.location.href = "/adicionarArmazem")}
            className="bg-orange-600 text-white py-5 rounded-xl shadow-lg hover:bg-orange-700 
                       transition font-semibold text-lg h-full"
          >
            🏭 Adicionar Armazém
          </button>


        </div>

        {/* ======== Dashboard ======== */}
        <div className="mb-12">
          <Dashboard />
        </div>

      </div>

      <Footer />
    </div>
  );
}
