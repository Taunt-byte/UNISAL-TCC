"use client";
import { useState } from "react";

interface Movement {
  productName: string;
  type: "entrada" | "saida";
  amount: number;
  date: string;
}

export default function HistoricoPage() {
  // exemplo inicial (depois você puxaria do mesmo state/context do estoque)
  const [movements, setMovements] = useState<Movement[]>([
    { productName: "Arroz", type: "entrada", amount: 50, date: "30/08/2025 10:00" },
    { productName: "Feijão", type: "saida", amount: 20, date: "30/08/2025 11:30" },
    { productName: "Arroz", type: "saida", amount: 10, date: "30/08/2025 12:00" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Histórico Completo 📜
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-b px-4 py-3">Produto</th>
              <th className="border-b px-4 py-3">Tipo</th>
              <th className="border-b px-4 py-3">Quantidade</th>
              <th className="border-b px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Nenhuma movimentação registrada
                </td>
              </tr>
            ) : (
              movements.map((move, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{move.productName}</td>
                  <td className="border-b px-4 py-2">
                    {move.type === "entrada" ? "Entrada" : "Saída"}
                  </td>
                  <td className="border-b px-4 py-2">{move.amount}</td>
                  <td className="border-b px-4 py-2">{move.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
