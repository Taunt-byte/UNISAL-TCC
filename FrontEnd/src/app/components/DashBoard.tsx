"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Package, ShoppingBag, Layers, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:4000";

  useEffect(() => {
    async function fetchData() {
      try {
        const s = await fetch(`${API}/dashboard/stats`).then((r) => r.json());
        const a = await fetch(`${API}/dashboard/alerts?t=10`).then((r) => r.json());

        setStats(s);
        setAlerts(a);
      } catch (err) {
        console.error("Erro ao buscar dados", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="w-full flex justify-center mt-10 text-white text-xl bg-gray-900 border border-black rounded-2xl shadow-md p-6">
        Carregando dashboard...
      </div>
    );
  }

  // Dados do gráfico
  const chartData = Object.entries(stats.seriesMonthly).map(([mes, dados]: any) => ({
    mes,
    entrada: dados.entrada,
    saida: dados.saida,
  }));

  return (
    <div className="p-6 text-white space-y-6" style={{ fontFamily: "Cambria" }}>
      
      {/* =================== CARDS =================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <StatCard 
          icon={<Package size={30} />}
          title="Total de Produtos"
          value={stats.totalProdutos}
        />

        <StatCard 
          icon={<Layers size={30} />}
          title="Produtos em Estoque"
          value={stats.produtosEmEstoque}
        />

        <StatCard 
          icon={<ShoppingBag size={30} />}
          title="Produtos produzidos"
          value={stats.produtosProduzidos}
        />

        <StatCard 
          icon={<DollarSign size={30} />}
          title="Custo Total"
          value={`R$ ${stats.custoTotal.toFixed(2)}`}
        />
      </div>

      {/* =================== GRÁFICO =================== */}
      <div className="bg-[#3B3030] border border-[#795757] rounded-2xl shadow-md p-6">
        <h2 className="text-white text-xl mb-4">Movimentações Mensais</h2>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="mes" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="entrada" fill="#4ade80" name="Entradas" />
              <Bar dataKey="saida" fill="#f87171" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =================== ALERTAS =================== */}
      <div className="bg-[#3B3030] border border-[#795757] rounded-2xl shadow-md p-6">
        <h2 className="text-white text-xl flex gap-2 items-center mb-4">
          <AlertTriangle className="text-yellow-400" /> Alertas de Estoque Baixo
        </h2>

        {alerts.length === 0 ? (
          <p className="text-green-300 text-lg">Nenhum produto em situação crítica.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((p) => (
              <li
                key={p._id}
                className="p-3 bg-[#795757] rounded-xl text-white shadow-md"
              >
                <strong>{p.nome}</strong> — {p.quantidade} unidades
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* =================== COMPONENTE DE CARD =================== */
function StatCard({ icon, title, value }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-[#3B3030] border border-[#795757] rounded-2xl text-white shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#795757] rounded-2xl text-white shadow-md">
            {icon}
          </div>
          <div>
            <p className="text-sm">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
