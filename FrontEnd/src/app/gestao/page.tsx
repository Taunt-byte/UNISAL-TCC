"use client";

import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Navbar";

// Registro dos módulos do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Item {
  id: number;
  name: string;
  date: string;
}

export default function GestaoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");

  const addItem = () => {
    const trimmedName = newItemName.trim();
    if (!trimmedName) return;

    const newItem: Item = {
      id: Date.now(),
      name: trimmedName,
      date: new Date().toISOString().split("T")[0],
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName("");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Cálculo memoizado dos dados do gráfico
  const chartData = useMemo(() => {
    const uniqueDates = [...new Set(items.map((item) => item.date))].sort();
    const counts = uniqueDates.map(
      (date) => items.filter((item) => item.date === date).length
    );

    return {
      labels: uniqueDates,
      datasets: [
        {
          label: "Quantidade de Itens",
          data: counts,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.2,
        },
      ],
    };
  }, [items]);

  return (
    <div className="text-gray-900 bg-gray-100">
        <Navbar />
    <div className="p-6 max-w-3xl mx-auto text-white font-cambria bg-black min-h-screen rounded-2xl shadow-lg">
  
      <h1 className="text-3xl font-bold mb-8 text-center">Gestão de Itens</h1>

      {/* Seção de Adição */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="border border-[#795757] bg-transparent p-2 rounded mb-4 sm:mb-0 sm:mr-3 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#795757]"
          placeholder="Nome do item"
        />
        <button
          onClick={addItem}
          className="bg-[#795757] hover:bg-[#9b6c6c] text-white px-5 py-2 rounded transition"
        >
          Adicionar
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Lista de Itens</h2>
        {items.length === 0 ? (
          <p className="text-center text-gray-300">Nenhum item adicionado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border border-[#795757] p-3 rounded-lg bg-[#4a3a3a]"
              >
                <span>
                  {item.name} — <span className="text-gray-300">{item.date}</span>
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gráfico */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Gráfico de Itens</h2>
        {items.length > 0 ? (
          <div className="h-[400px] bg-[#4a3a3a] p-4 rounded-xl border border-[#795757]">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="text-center text-gray-300">Adicione itens para visualizar o gráfico.</p>
        )}
      </div>
    </div>
    </div>
  );
}
