"use client";
import React from "react";

interface DashboardCardsProps {
  totalProdutos: number;
  produtosEmEstoque: number;
  produtosVendidos: number;
  custoTotal: number;
}

export default function DashboardCards({
  totalProdutos,
  produtosEmEstoque,
  produtosVendidos,
  custoTotal,
}: DashboardCardsProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6 p-6 bg-violet-800"
      style={{
        color: "white",
        fontFamily: "Cambria",
      }}
    >
      <div className="rounded-2xl shadow-md p-4 text-center text-white bg-red-600" >
        <h2 className="text-lg font-semibold mb-2">Total de Produtos</h2>
        <p className="text-3xl font-bold">{totalProdutos}</p>
      </div>

      <div className="rounded-2xl shadow-md p-4 text-center text-white bg-red-600">
        <h2 className="text-lg font-semibold mb-2">Em Estoque</h2>
        <p className="text-3xl font-bold">{produtosEmEstoque}</p>
      </div>

      <div className="rounded-2xl shadow-md p-4 text-center text-white bg-red-600">
        <h2 className="text-lg font-semibold mb-2">Vendidos</h2>
        <p className="text-3xl font-bold">{produtosVendidos}</p>
      </div>

      <div className="rounded-2xl shadow-md p-4 text-center text-white bg-red-600">
        <h2 className="text-lg font-semibold mb-2">Custo Total (R$)</h2>
        <p className="text-3xl font-bold">{custoTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
