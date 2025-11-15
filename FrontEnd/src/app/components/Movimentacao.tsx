"use client";
import React, { useState, useEffect } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Produto {
  _id: string;
  nome: string;
  estoque: number;
  estoqueMinimo: number;
}

interface Movimentacao {
  tipo: "entrada" | "saida";
  quantidade: number;
  produtoId: string;
  data: string;
}

export default function Movimentacoes() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [movimentacao, setMovimentacao] = useState<Movimentacao>({
    tipo: "entrada",
    quantidade: 0,
    produtoId: "",
    data: new Date().toISOString().split("T")[0],
  });
  const [mensagem, setMensagem] = useState("");

  // Carrega produtos do banco
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch("http://localhost:4000/items");
        const data = await res.json();

        const produtosTratados = data.map((item: any) => ({
          _id: item._id,
          nome: item.nome,
          estoque: item.quantidade,
          estoqueMinimo: 10,
        }));

        setProdutos(produtosTratados);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }

    carregarProdutos();
  }, []);

  // REGISTRAR MOVIMENTAÇÃO (agora conectado ao backend)
  async function registrar(e: React.FormEvent) {
    e.preventDefault();

    if (!movimentacao.produtoId) {
      setMensagem("❌ Selecione um produto!");
      return;
    }

    if (movimentacao.quantidade <= 0) {
      setMensagem("❌ Quantidade inválida!");
      return;
    }

    const produto = produtos.find((p) => p._id === movimentacao.produtoId);
    if (!produto) return;

    // Verifica saída maior que estoque
    if (movimentacao.tipo === "saida" && movimentacao.quantidade > produto.estoque) {
      setMensagem("❌ A quantidade de saída é maior que o estoque disponível!");
      return;
    }

    // Envia para o backend
    try {
      const response = await fetch("http://localhost:4000/movimentacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movimentacao),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem("❌ " + data.error);
        return;
      }

      // Atualiza estoque local
      setProdutos((antigos) =>
        antigos.map((p) =>
          p._id === movimentacao.produtoId
            ? { ...p, estoque: data.novoEstoque }
            : p
        )
      );

      setMensagem(`✅ Movimentação registrada com sucesso!`);

    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao registrar movimentação.");
    }
  }

  return (
    <div
      className="min-h-screen p-10"
      style={{
        backgroundColor: "#000000",
        color: "white",
        fontFamily: "Cambria",
      }}
    >
      <h1 className="text-4xl font-bold mb-8 text-violet-400">
        Registro de Movimentações (Entrada/Saída)
      </h1>

      <form onSubmit={registrar} className="bg-violet-900 p-8 rounded-2xl shadow-xl max-w-2xl">
        <h2 className="text-2xl font-semibold mb-5">Registrar Movimentação</h2>

        {/* Tipo */}
        <label className="block mb-3">
          Tipo de Movimentação:
          <select
            value={movimentacao.tipo}
            onChange={(e) =>
              setMovimentacao({ ...movimentacao, tipo: e.target.value as "entrada" | "saida" })
            }
            className="w-full p-3 rounded-lg bg-violet-700 text-white mt-1"
          >
            <option value="entrada">Entrada (Compra)</option>
            <option value="saida">Saída (Venda)</option>
          </select>
        </label>

        {/* Produto */}
        <label className="block mb-3">
          Produto:
          <select
            value={movimentacao.produtoId}
            onChange={(e) =>
              setMovimentacao({ ...movimentacao, produtoId: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-violet-700 text-white mt-1"
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome} — Estoque atual: {p.estoque}
              </option>
            ))}
          </select>
        </label>

        {/* Quantidade */}
        <label className="block mb-3">
          Quantidade:
          <input
            type="number"
            value={movimentacao.quantidade}
            onChange={(e) =>
              setMovimentacao({ ...movimentacao, quantidade: Number(e.target.value) })
            }
            className="w-full p-3 rounded-lg bg-violet-700 text-white mt-1"
            required
            min={1}
          />
        </label>

        {/* Data */}
        <label className="block mb-3">
          Data:
          <input
            type="date"
            value={movimentacao.data}
            onChange={(e) =>
              setMovimentacao({ ...movimentacao, data: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-violet-700 text-white mt-1"
          />
        </label>

        <button
          type="submit"
          className="mt-5 w-full bg-violet-600 hover:bg-violet-500 p-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2"
        >
          {movimentacao.tipo === "entrada" ? (
            <ArrowDownCircle className="w-6 h-6" />
          ) : (
            <ArrowUpCircle className="w-6 h-6" />
          )}
          Registrar {movimentacao.tipo === "entrada" ? "Entrada" : "Saída"}
        </button>
      </form>

      {mensagem && (
        <p className="mt-6 bg-violet-700 p-4 rounded-xl text-center text-lg font-semibold">
          {mensagem}
        </p>
      )}
    </div>
  );
}
