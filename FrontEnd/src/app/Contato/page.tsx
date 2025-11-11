"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContatoPage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    if (!form.nome || !form.email || !form.mensagem) {
      toast.error("Preencha todos os campos!");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/enviarEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Mensagem enviada com sucesso!");
      setForm({ nome: "", email: "", mensagem: "" });
    } else {
      toast.error("Erro ao enviar. Tente novamente.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
      <Navbar />

      {/* CONTEÚDO */}
      <div className="flex-grow flex items-center justify-center px-4 py-10 ">

        <Toaster />

        <div className="bg-white/90 backdrop-blur-md text-black max-w-xl w-full p-10 rounded-3xl shadow-xl border border-gray-300">
          
          <h1 className="text-4xl font-bold text-center mb-4 text-violet-800 drop-shadow-sm">
            Entre em Contato
          </h1>

          <p className="text-center mb-8 text-gray-700 text-lg">
            Preencha o formulário abaixo e retornaremos o mais rápido possível.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Nome</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-600 shadow-sm bg-gray-50"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-600 shadow-sm bg-gray-50"
                placeholder="seuemail@email.com"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">Mensagem</label>
              <textarea
                rows={5}
                name="mensagem"
                value={form.mensagem}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-violet-600 shadow-sm bg-gray-50"
                placeholder="Escreva sua mensagem..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-violet-800 transition shadow-md disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
