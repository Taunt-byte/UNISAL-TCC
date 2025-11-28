"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

// Cores para gráficos de pizza
const COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

export default function GraficoEstoque() {
  const [items, setItems] = useState<any[]>([]);
  const [agrupadoPorArmazem, setAgrupadoPorArmazem] = useState<any>({});
  const [topLimit, setTopLimit] = useState(10);
  const [topArmazemLimit, setTopArmazemLimit] = useState(5);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);

        // Agrupar por armazém
        const grupo: any = {};
        data.forEach((item: any) => {
          if (!grupo[item.armazem]) grupo[item.armazem] = [];
          grupo[item.armazem].push(item);
        });

        setAgrupadoPorArmazem(grupo);
      });
  }, []);

  // ----------------------------
  // TOP N ITENS PARA HEATMAP
  // ----------------------------
  const topItens = [...items]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, topLimit);

  // ----------------------------
  // Dados para Pizza (armazéns)
  // ----------------------------
  const armazemSoma = Object.keys(agrupadoPorArmazem).map((armz) => ({
    name: armz,
    total: agrupadoPorArmazem[armz].reduce(
      (acc: any, cur: any) => acc + cur.quantidade,
      0
    ),
  }));

  const topArmazens = armazemSoma
    .sort((a, b) => b.total - a.total)
    .slice(0, topArmazemLimit);

  return (
    <div className="min-h-screen bg-white text-black font-[Cambria]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* TÍTULO */}
        <h1 className="text-4xl font-bold text-center text-[#6B21A8] mb-10">
          Painel Avançado de Estoque
        </h1>

        {/* ===================================== */}
        {/*         GRÁFICO GERAL (TOP N)        */}
        {/* ===================================== */}
        <div className="bg-[#F3E8FF] p-6 rounded-xl shadow-md border border-[#D8B4FE] mb-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#6B21A8]">
              Quantidade por Produto
            </h2>

            {/* SELECT TOP N */}
            <select
              className="p-2 bg-white border border-purple-300 rounded-lg"
              onChange={(e) => setTopLimit(Number(e.target.value))}
            >
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
              <option value={items.length}>Todos</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={topItens}>
              <CartesianGrid strokeDasharray="3 3" stroke="#BFA5E5" />
              <XAxis dataKey="nome" stroke="#6B21A8" />
              <YAxis stroke="#6B21A8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D8B4FE",
                  borderRadius: "10px",
                  color: "black",
                }}
              />
              <Bar dataKey="quantidade" fill="#A855F7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ===================================== */}
        {/*                HEATMAP                */}
        {/* ===================================== */}
        <div className="bg-[#F3E8FF] p-6 rounded-xl shadow-md border border-[#D8B4FE] mb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-[#6B21A8]">
              🔥 Heatmap — Itens com Maior Estoque
            </h2>

            <select
              className="p-2 bg-white border border-purple-300 rounded-lg"
              onChange={(e) => setTopLimit(Number(e.target.value))}
            >
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
              <option value={items.length}>Todos</option>
            </select>
          </div>

          {/* Heatmap */}
          <div className="grid grid-cols-5 gap-3">
            {topItens.map((item) => {
              const intensidade = Math.min(item.quantidade / 100, 1);

              const cor = `rgba(168, 85, 247, ${intensidade})`;

              return (
                <div
                  key={item._id}
                  className="p-4 rounded-lg text-center text-white font-bold"
                  style={{ backgroundColor: cor }}
                >
                  {item.nome}
                  <div className="text-sm">{item.quantidade} un</div>
                </div>
              );
            })}
          </div>
        </div>
            {/* ============================================= */}
{/*   PIZZAS POR ARMAZÉM — ITENS INTERNOS        */}
{/* ============================================= */}
<h2 className="text-3xl font-bold text-[#6B21A8] mt-20 mb-6 text-center">
  🍕 Itens Por Armazém — Gráficos de Pizza
</h2>

{Object.keys(agrupadoPorArmazem).map((armazem) => {
  const itens = agrupadoPorArmazem[armazem]
    .sort((a: any, b: any) => b.quantidade - a.quantidade);

  // TOP N por armazém
  const topItensArmazem = itens.slice(0, topLimit);

  return (
    <div
      key={armazem}
      className="bg-[#F3E8FF] p-6 rounded-xl shadow-md border border-[#D8B4FE] mb-16"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-[#6B21A8]">
          📦 Armazém: {armazem}
        </h2>

        <select
          className="p-2 bg-white border border-purple-300 rounded-lg"
          onChange={(e) => setTopLimit(Number(e.target.value))}
        >
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
          <option value={itens.length}>Todos</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={topItensArmazem.map((item: any) => ({
              name: item.nome,
              value: item.quantidade,
            }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {topItensArmazem.map((_: any, idx: number) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <p className="text-center mt-4 text-black text-lg">
        Mostrando <strong>Top {topLimit}</strong> itens do armazém <strong>{armazem}</strong>
      </p>
    </div>
  );
})}

        {/* ============================================= */}
        {/*   GRÁFICO DE PIZZA - COMPARAÇÃO ARMAZÉNS     */}
        {/* ============================================= */}
        <div className="bg-[#F3E8FF] p-6 rounded-xl shadow-md border border-[#D8B4FE] mb-16">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-[#6B21A8]">
              🏭 Comparação entre Armazéns
            </h2>

            <select
              className="p-2 bg-white border border-purple-300 rounded-lg"
              onChange={(e) => setTopArmazemLimit(Number(e.target.value))}
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value={armazemSoma.length}>Todos</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={topArmazens}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#A855F7"
                label
              >
                {topArmazens.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Footer />
    </div>
  );
}
