"use client";

import { useEffect, useState } from "react";
import { Search, Package, Warehouse, DollarSign, Layers } from "lucide-react";

export default function DashboardProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/items");
        const data = await res.json();
        setProdutos(data);
      } catch (e) {
        console.error("Erro ao carregar produtos:", e);
      }
      setLoading(false);
    }

    load();
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalProdutos = produtos.length;
  const totalEstoque = produtos.reduce((acc, p) => acc + Number(p.quantidade), 0);
  const custoTotal = produtos.reduce((acc, p) => acc + Number(p.custo), 0);

  return (
    <div className="p-6 bg-white min-h-screen font-[Cambria] text-[#3A0CA3]">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold mb-8 text-center text-[#5B21B6]">
        📦 Dashboard de Produtos
      </h1>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-[#F3E8FF] border border-[#D8B4FE] shadow-md rounded-2xl p-6 flex items-center gap-4">
          <Package className="w-12 h-12 text-[#7C3AED]" />
          <div>
            <p className="text-sm text-[#6B21A8]">Total de Produtos</p>
            <p className="text-3xl font-bold text-black">{totalProdutos}</p>
          </div>
        </div>

        <div className="bg-[#F3E8FF] border border-[#D8B4FE] shadow-md rounded-2xl p-6 flex items-center gap-4">
          <Layers className="w-12 h-12 text-[#6D28D9]" />
          <div>
            <p className="text-sm text-[#6B21A8]">Itens em Estoque</p>
            <p className="text-3xl font-bold text-black">{totalEstoque}</p>
          </div>
        </div>

        <div className="bg-[#F3E8FF] border border-[#D8B4FE] shadow-md rounded-2xl p-6 flex items-center gap-4">
          <DollarSign className="w-12 h-12 text-[#9333EA]" />
          <div>
            <p className="text-sm text-[#6B21A8]">Custo Total</p>
            <p className="text-3xl font-bold text-black">R$ {custoTotal}</p>
          </div>
        </div>

      </div>

      {/* BARRA DE BUSCA */}
      <div className="flex items-center bg-[#F3E8FF] border border-[#D8B4FE] shadow-md rounded-2xl p-4 w-full md:w-2/3 mb-6 mx-auto">
        <Search className="text-[#6B21A8] mr-3" />
        <input
          type="text"
          placeholder="Buscar produto..."
          className="outline-none w-full bg-transparent text-black"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* TABELA */}
      <div className="bg-white shadow-lg border border-[#D8B4FE] rounded-2xl overflow-hidden">

        {loading ? (
          <div className="p-6 animate-pulse text-gray-500">Carregando produtos...</div>
        ) : (
          <table className="w-full text-left">

            {/* CABEÇALHO */}
            <thead className="bg-[#E9D5FF] text-[#4C1D95]">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Armazém</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Custo</th>
                <th className="p-4">Chegada</th>
              </tr>
            </thead>

            {/* CORPO */}
            <tbody>
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-[#E9D5FF] hover:bg-[#F3E8FF] transition"
                  >
                    <td className="p-4 text-black">{p.nome}</td>
                    <td className="p-4 text-black">{p.armazem}</td>
                    <td className="p-4 text-black">{p.quantidade}</td>
                    <td className="p-4 text-black">R$ {p.custo}</td>
                    <td className="p-4 text-black">
                      {new Date(p.dataChegada).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}
