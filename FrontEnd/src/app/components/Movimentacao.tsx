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

  // Mock inicial (depois você liga com o backend real)
  useEffect(() => {
    setProdutos([
      { _id: "1", nome: "Placa Arduino", estoque: 120, estoqueMinimo: 20 },
      { _id: "2", nome: "Sensor PIR", estoque: 45, estoqueMinimo: 10 },
      { _id: "3", nome: "Fonte 12V", estoque: 18, estoqueMinimo: 5 },
    ]);
  }, []);

  function registrar(e: React.FormEvent) {
    e.preventDefault();

    const produto = produtos.find((p) => p._id === movimentacao.produtoId);
    if (!produto) return;

    if (movimentacao.tipo === "saida" && movimentacao.quantidade > produto.estoque) {
      setMensagem("❌ A quantidade de saída é maior que o estoque disponível!");
      return;
    }

    // Atualiza o estoque
    const novoEstoque =
      movimentacao.tipo === "entrada"
        ? produto.estoque + movimentacao.quantidade
        : produto.estoque - movimentacao.quantidade;

    const atualizado = produtos.map((p) =>
      p._id === produto._id ? { ...p, estoque: novoEstoque } : p
    );
    setProdutos(atualizado);

    setMensagem(
      `✅ Movimentação registrada com sucesso! Estoque atual de "${produto.nome}": ${novoEstoque}`
    );

    // Alerta de estoque mínimo
    if (novoEstoque < produto.estoqueMinimo) {
      setMensagem(
        `⚠️ Atenção: O produto "${produto.nome}" está abaixo do estoque mínimo! Estoque atual: ${novoEstoque}`
      );
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

      {/* ---------- FORMULÁRIO PRINCIPAL ---------- */}
      <form
        onSubmit={registrar}
        className="bg-violet-900 p-8 rounded-2xl shadow-xl max-w-2xl"
      >
        <h2 className="text-2xl font-semibold mb-5">Registrar Movimentação</h2>

        {/* Tipo */}
        <label className="block mb-3">
          Tipo de Movimentação:
          <select
            value={movimentacao.tipo}
            onChange={(e) =>
              setMovimentacao({
                ...movimentacao,
                tipo: e.target.value as "entrada" | "saida",
              })
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
              setMovimentacao({
                ...movimentacao,
                produtoId: e.target.value,
              })
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
              setMovimentacao({
                ...movimentacao,
                quantidade: Number(e.target.value),
              })
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
              setMovimentacao({
                ...movimentacao,
                data: e.target.value,
              })
            }
            className="w-full p-3 rounded-lg bg-violet-700 text-white mt-1"
          />
        </label>

        {/* Botão */}
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

      {/* ---------- MENSAGEM ---------- */}
      {mensagem && (
        <p className="mt-6 bg-violet-700 p-4 rounded-xl text-center text-lg font-semibold">
          {mensagem}
        </p>
      )}
    </div>
  );
}
