"use client";
import React from "react";
import { Package, Layers, ShoppingBag, DollarSign } from "lucide-react";

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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-lg font-[Cambria] bg-violet-800 text-white shadow-lg">
      {/* CARD 1 */}
      <div className="rounded-2xl shadow-lg p-5 text-center bg-violet-700 hover:bg-violet-600 transition-all">
        <Package className="w-10 h-10 mx-auto mb-3" />
        <h2 className="text-lg font-semibold mb-1">Total de Produtos</h2>
        <p className="text-3xl font-bold">{totalProdutos}</p>
      </div>

      {/* CARD 2 */}
      <div className="rounded-2xl shadow-lg p-5 text-center bg-violet-700 hover:bg-violet-600 transition-all">
        <Layers className="w-10 h-10 mx-auto mb-3" />
        <h2 className="text-lg font-semibold mb-1">Em Estoque</h2>
        <p className="text-3xl font-bold">{produtosEmEstoque}</p>
      </div>

      {/* CARD 3 */}
      <div className="rounded-2xl shadow-lg p-5 text-center bg-violet-700 hover:bg-violet-600 transition-all">
        <ShoppingBag className="w-10 h-10 mx-auto mb-3" />
        <h2 className="text-lg font-semibold mb-1">Vendidos</h2>
        <p className="text-3xl font-bold">{produtosVendidos}</p>
      </div>

      {/* CARD 4 */}
      <div className="rounded-2xl shadow-lg p-5 text-center bg-violet-700 hover:bg-violet-600 transition-all">
        <DollarSign className="w-10 h-10 mx-auto mb-3" />
        <h2 className="text-lg font-semibold mb-1">Custo Total (R$)</h2>
        <p className="text-3xl font-bold">{custoTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
