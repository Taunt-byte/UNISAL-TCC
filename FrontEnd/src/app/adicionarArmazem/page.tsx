"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddArmazemPage() {
  const [form, setForm] = useState({
    nome: "",
    localizacao: "",
    tipo: "",
    capacidade: "",
    responsavel: "",
    descricao: "",
    dataInauguracao: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso" | "">("");

  // Máscara de data
  function maskDate(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length > 2) value = value.replace(/(\d{2})(\d)/, "$1/$2");
    if (value.length > 5) value = value.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    if (value.length > 10) value = value.substring(0, 10);
    return value;
  }

  function handleChange(e: any) {
    if (e.target.name === "dataInauguracao") {
      setForm({ ...form, dataInauguracao: maskDate(e.target.value) });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const cadastrarArmazem = async (e: any) => {
    e.preventDefault();
    setMensagem("");

    if (!form.nome.trim()) {
      setTipoMensagem("erro");
      setMensagem("O nome do armazém é obrigatório.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/armazens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setTipoMensagem("erro");
        setMensagem(data.error || "Erro ao criar armazém.");
        return;
      }

      setTipoMensagem("sucesso");
      setMensagem("Armazém cadastrado com sucesso!");

      setForm({
        nome: "",
        localizacao: "",
        tipo: "",
        capacidade: "",
        responsavel: "",
        descricao: "",
        dataInauguracao: "",
      });

    } catch (error) {
      setTipoMensagem("erro");
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#4B0082] text-white font-[Cambria]">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Cadastrar Armazém
        </h1>

        <form
          onSubmit={cadastrarArmazem}
          className="bg-[#6A0DAD] p-8 rounded-2xl shadow-xl space-y-6 border border-white/20"
        >
          {/* Nome */}
          <div>
            <label className="block mb-2 text-lg font-semibold">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
              placeholder="Ex: Armazém Principal"
              required
            />
          </div>

          {/* Localização */}
          <div>
            <label className="block mb-2 text-lg font-semibold">Localização</label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
              placeholder="Ex: Galpão 3"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block mb-2 text-lg font-semibold">Tipo do Armazém</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
            >
              <option value="">Selecione...</option>
              <option value="Frigorificado">Frigorificado</option>
              <option value="Paletes">Paletes</option>
              <option value="Graneleiro">Graneleiro</option>
              <option value="Ar Livre">Ar Livre / Externo</option>
              <option value="Produtos Químicos">Produtos Químicos</option>
              <option value="Materiais Leves">Materiais Leves</option>
            </select>
          </div>

          {/* Capacidade */}
          <div>
            <label className="block mb-2 text-lg font-semibold">
              Capacidade (m³ ou kg)
            </label>
            <input
              type="number"
              name="capacidade"
              value={form.capacidade}
              onChange={handleChange}
              placeholder="Ex: 15000"
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block mb-2 text-lg font-semibold">
              Responsável / Supervisor
            </label>
            <input
              type="text"
              name="responsavel"
              value={form.responsavel}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Data de inauguração */}
          <div>
            <label className="block mb-2 text-lg font-semibold">
              Data de Inauguração
            </label>
            <input
              type="text"
              name="dataInauguracao"
              value={form.dataInauguracao}
              onChange={handleChange}
              placeholder="dd/mm/aaaa"
              maxLength={10}
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block mb-2 text-lg font-semibold">
              Descrição / Observações
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg bg-[#3B0066] text-white outline-none border border-white/20"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 bg-[#3B0066] rounded-lg text-white font-bold hover:opacity-80 transition"
          >
            Salvar Armazém
          </button>

          {/* Mensagem */}
          {mensagem && (
            <p
              className={`text-center font-bold mt-4 ${
                tipoMensagem === "erro" ? "text-red-300" : "text-green-300"
              }`}
            >
              {mensagem}
            </p>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
}
