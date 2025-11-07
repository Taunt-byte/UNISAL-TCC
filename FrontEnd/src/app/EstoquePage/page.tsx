"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import { Item, getDatePart } from "../components/types";
import DashboardCards from "../components/DashBoardCards";
import DashboardCharts from "../components/DashBoardCharts";

export default function EstoquePage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const handleSave = async (novo: Omit<Item, "_id">) => {
    const res = await fetch("http://localhost:4000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });
    const created = await res.json();
    setItems((prev) => [created, ...prev]);
  };

  const totalEstoque = useMemo(
    () => items.reduce((acc, i) => acc + i.quantidade, 0),
    [items]
  );

  return (
    <div className="bg-gray-100 min-h-screen text-black font-[Cambria]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl  font-bold text-center mb-8">Gestão de Estoque</h1>

        <ProductForm onSave={handleSave} totalAtual={totalEstoque} />
    <div>
      <DashboardCards
        totalProdutos={280}
        produtosEmEstoque={220}
        produtosVendidos={60}
        custoTotal={15200.75}
      />

      <DashboardCharts capacidadeAtual={220} />
    </div>
      </div>
    </div>
  );
}
