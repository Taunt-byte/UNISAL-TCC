"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface MovItem {
  _id: string;
  produto: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
}

export default function RegistroMovimentacao() {
  const [movs, setMovs] = useState<MovItem[]>([]);
  const [form, setForm] = useState({
    produto: "",
    tipo: "entrada",
    quantidade: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/movimentacoes")
      .then((res) => res.json())
      .then(setMovs)
      .catch(console.error);
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!form.produto || !form.quantidade) {
      alert("Preencha todos os campos!");
      return;
    }

    const res = await fetch("http://localhost:4000/movimentacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const novaMov = await res.json();
    setMovs((prev) => [novaMov, ...prev]);

    setForm({ produto: "", tipo: "entrada", quantidade: "" });
  }

  return (
    <div className="bg-gray-100 min-h-screen text-black font-[Cambria]">
      <Navbar />

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-violet-800">
          Registro de Movimentações
        </h1>

        {/* CARD DO FORMULÁRIO */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-10">
          <h2 className="text-xl font-bold mb-5 text-violet-700">
            Registrar Entrada/Saída
          </h2>

          <form
            className="grid md:grid-cols-4 gap-5"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="produto"
              value={form.produto}
              onChange={handleChange}
              placeholder="Nome do produto"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-violet-600"
            />

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="p-3 border rounded-xl bg-white focus:ring-2 focus:ring-violet-600"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>

            <input
              type="number"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="Quantidade"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-violet-600"
            />

            <button
              type="submit"
              className="bg-violet-700 text-white font-bold rounded-xl hover:bg-violet-800 transition px-5 py-2"
            >
              Registrar
            </button>
          </form>
        </div>

        {/* LISTA DE MOVIMENTAÇÕES */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-5 text-violet-700">
            Histórico de Movimentações
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-violet-700 text-white text-left">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Quantidade</th>
                  <th className="p-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {movs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      Nenhuma movimentação registrada ainda.
                    </td>
                  </tr>
                ) : (
                  movs.map((m) => (
                    <tr
                      key={m._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{m.produto}</td>
                      <td
                        className={`p-3 font-semibold ${
                          m.tipo === "entrada"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {m.tipo.toUpperCase()}
                      </td>
                      <td className="p-3">{m.quantidade}</td>
                      <td className="p-3">
                        {new Date(m.data).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
