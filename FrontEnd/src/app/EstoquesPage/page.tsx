"use client";

import { useState, useEffect } from "react";

interface Stock {
  id: number;
  name: string;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  description?: string;
  quantity: number;
}

export default function EstoquesPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockName, setStockName] = useState("");

  async function loadStocks() {
    const res = await fetch("http://localhost:4000/stocks");
    setStocks(await res.json());
  }

  async function addStock() {
    await fetch("http://localhost:4000/stocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: stockName }),
    });
    setStockName("");
    loadStocks();
  }

  useEffect(() => {
    loadStocks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estoques</h1>
      <input
        type="text"
        placeholder="Novo estoque"
        value={stockName}
        onChange={(e) => setStockName(e.target.value)}
        className="border px-3 py-2 rounded mr-2"
      />
      <button onClick={addStock} className="bg-blue-500 text-white px-4 py-2 rounded">Adicionar</button>

      <ul className="mt-6">
        {stocks.map((s) => (
          <li key={s.id} className="border p-4 rounded mb-2">
            <strong>{s.name}</strong> - {s.products.length} produtos
          </li>
        ))}
      </ul>
    </div>
  );
}
