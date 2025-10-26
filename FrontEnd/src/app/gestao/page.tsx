"use client";

import { useEffect, useState, useMemo } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Item {
  _id: string;
  name: string;
  createdAt: string;
}

export default function GestaoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Carregar itens do backend
  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  // Adicionar ou atualizar item
  const saveItem = async () => {
    if (!newItemName.trim()) return;

    if (editingItem) {
      const res = await fetch(`http://localhost:4000/items/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName }),
      });
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      setEditingItem(null);
    } else {
      const res = await fetch("http://localhost:4000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName }),
      });
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
    }

    setNewItemName("");
  };

  // Remover item
  const removeItem = async (id: string) => {
    await fetch(`http://localhost:4000/items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  // Gráfico
  const chartData = useMemo(() => {
    const dates = [...new Set(items.map((i) => i.createdAt.split("T")[0]))];
    const counts = dates.map((d) => items.filter((i) => i.createdAt.startsWith(d)).length);
    return {
      labels: dates.reverse(),
      datasets: [
        {
          label: "Itens criados",
          data: counts.reverse(),
          borderColor: "#00FFB2",
          backgroundColor: "rgba(0,255,178,0.2)",
          tension: 0.3,
        },
      ],
    };
  }, [items]);

  return (
    <div className="text-white bg-[#3B3030] min-h-screen">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto font-cambria">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestão de Itens</h1>

        <div className="flex flex-col sm:flex-row items-center mb-6">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="border border-[#795757] bg-transparent p-2 rounded mb-4 sm:mb-0 sm:mr-3 w-full sm:w-auto focus:outline-none"
            placeholder="Nome do item"
          />
          <button
            onClick={saveItem}
            className="bg-[#795757] hover:bg-[#9b6c6c] text-white px-5 py-2 rounded transition"
          >
            {editingItem ? "Salvar edição" : "Adicionar"}
          </button>
        </div>

        {/* Lista de Itens */}
        {items.length === 0 ? (
          <p className="text-center text-gray-300">Nenhum item adicionado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center border border-[#795757] p-3 rounded-lg bg-[#4a3a3a]"
              >
                <span>
                  {item.name} —{" "}
                  <span className="text-gray-300">{item.createdAt.split("T")[0]}</span>
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setNewItemName(item.name);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Gráfico */}
        <div className="mt-10 bg-[#4a3a3a] p-4 rounded-xl border border-[#795757]">
          {items.length > 0 ? (
            <Line data={chartData} options={{ maintainAspectRatio: false }} height={300} />
          ) : (
            <p className="text-center text-gray-300">Adicione itens para ver o gráfico.</p>
          )}
        </div>
      </div>
    </div>
  );
}
