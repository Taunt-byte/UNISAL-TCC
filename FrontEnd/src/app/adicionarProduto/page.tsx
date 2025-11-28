"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdicionarProduto() {
  const [form, setForm] = useState({
    nome: "",
    quantidade: "",
    armazem: "",
    dataChegada: "",
    custo: "",
  });

  const [armazens, setArmazens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- Máscara automática de data ----
  function maskDate(value: string) {
    value = value.replace(/\D/g, ""); 
    if (value.length > 2) value = value.replace(/(\d{2})(\d)/, "$1/$2");
    if (value.length > 5) value = value.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    if (value.length > 10) value = value.substring(0, 10);
    return value;
  }

  // ---- Inputs ----
  function handleChange(e: any) {
    if (e.target.name === "dataChegada") {
      setForm({ ...form, dataChegada: maskDate(e.target.value) });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ---- Armazéns ----
  useEffect(() => {
    fetch("http://localhost:4000/armazens")
      .then((res) => res.json())
      .then((data) => setArmazens(data))
      .catch(() => setArmazens([]));
  }, []);

  async function handleSubmit(e: any) {
  e.preventDefault();
  setMensagem("");
  setLoading(true);

  // Converte dd/mm/aaaa → aaaa-mm-dd
  function converterParaISO(data: string) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  try {
    const res = await fetch("http://localhost:4000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        quantidade: Number(form.quantidade),
        armazem: form.armazem,
        dataChegada: converterParaISO(form.dataChegada),
        custo: Number(form.custo),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensagem("Produto cadastrado com sucesso!");
      setForm({
        nome: "",
        quantidade: "",
        armazem: "",
        dataChegada: "",
        custo: "",
      });
    } else {
      setMensagem(data.error || "Erro ao cadastrar produto");
    }
  } catch (err) {
    setMensagem("Erro ao conectar com o servidor");
  }

  setLoading(false);
}


  return (
    <div className="min-h-screen text-white bg-white font-[Cambria]">

      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl text-black font-bold text-center mb-10">
          Adicionar Produto
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#6A0DAD] p-8 rounded-2xl shadow-xl space-y-6 border border-white/20"
        >

          {/* Nome */}
          <div>
            <label className="block mb-1 font-semibold">Nome do Produto</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="block mb-1 font-semibold">Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Armazém */}
          <div>
            <label className="block mb-1 font-semibold">Armazém</label>
            <select
              name="armazem"
              value={form.armazem}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-[#3B0066] text-white outline-none border border-white/20"
            >
              <option value="">Selecione um armazém...</option>
              {armazens.map((a: any) => (
                <option key={a._id} value={a.nome}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Data com máscara */}
          <div>
            <label className="block mb-1 font-semibold">Data de Chegada</label>
            <input
              type="text"
              name="dataChegada"
              placeholder="dd/mm/aaaa"
              value={form.dataChegada}
              onChange={handleChange}
              required
              maxLength={10}
              className="w-full p-3 rounded bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Custo */}
          <div>
            <label className="block mb-1 font-semibold">Custo (R$)</label>
            <input
              type="number"
              name="custo"
              value={form.custo}
              onChange={handleChange}
              step="0.01"
              className="w-full p-3 rounded bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Mensagem */}
          {mensagem && (
            <p className="text-center font-semibold mt-2">{mensagem}</p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B0066] py-3 rounded-xl font-bold text-white hover:opacity-80 transition border border-white/20"
          >
            {loading ? "Salvando..." : "Cadastrar Produto"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
