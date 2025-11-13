"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import CadastroProdutos from "../components/CadastroProdutos";
import { Item, getDatePart } from "../components/types";
import DashboardCards from "../components/DashBoard";
import Movimentacoes from "../components/Movimentacao";
import Footer from "../components/Footer";

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
      <div className="max-w-6xl mx-auto p-5">
        <h1 className="text-3xl font-bold text-center">
          Gestão de Estoque
        </h1>
        </div>
        <div className="max-w-6xl mx-auto p-2 p-6 mb-12">
        <DashboardCards
          totalProdutos={items.length}
          produtosEmEstoque={items.reduce(
            (acc, item) => acc + item.quantidade,
            0
          )}
          produtosVendidos={items.reduce((acc, item) => acc + item.vendidos, 0)}
          custoTotal={items.reduce(
            (acc, item) => acc + item.custo * item.quantidade,
            0
          )}
        />
      </div>
        <div>
        <CadastroProdutos onSave={handleSave} totalAtual={totalEstoque} />
        </div>
        <div>
          <Movimentacoes />
        </div>
      <Footer />
    </div>

    
  );
}
