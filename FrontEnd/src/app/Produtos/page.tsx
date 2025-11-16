// =====================
// Página: /produtos
// Tabela de produtos com editar / excluir / visualizar
// =====================

"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Item {
  _id: string;
  nome: string;
  quantidade: number;
  categoria: string;
  dataEntrada: string;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Item[]>([]);

  const carregar = () => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then(setProdutos);
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (id: string) => {
    await fetch(`http://localhost:4000/items/${id}`, { method: "DELETE" });
    carregar();
  };

  return (
    <div className="min-h-screen bg-[#3B3030] text-white font-[Cambria]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Produtos Cadastrados
        </h1>

        <div className="overflow-x-auto bg-[#795757] p-6 rounded-xl shadow-md">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/30">
                <th className="p-3">Nome</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Quantidade</th>
                <th className="p-3">Entrada</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p._id} className="border-b border-white/20">
                  <td className="p-3">{p.nome}</td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="p-3">{p.quantidade}</td>
                  <td className="p-3">
                    {new Date(p.dataEntrada).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-3">
                    <button className="px-3 py-1 bg-blue-600 rounded-md">
                      Ver
                    </button>
                    <button className="px-3 py-1 bg-yellow-500 rounded-md">
                      Editar
                    </button>
                    <button
                      onClick={() => remover(p._id)}
                      className="px-3 py-1 bg-red-600 rounded-md"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
