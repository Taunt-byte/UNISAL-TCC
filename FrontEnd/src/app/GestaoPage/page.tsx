"use client";

import { useState, useEffect } from "react";

interface Stock {
  id: number;
  name: string;
}

interface Movement {
  id: number;
  type: "entrada" | "saida";
  amount: number;
  date: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  stockId: number;
  movements: Movement[];
}

export default function GestaoPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "movements">>({
    name: "",
    description: "",
    quantity: 0,
    stockId: 0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);

  /** Carregar estoques */
  const loadStocks = async () => {
    const res = await fetch("http://localhost:4000/stocks");
    const data: Stock[] = await res.json();
    setStocks(data);
    if (!selectedStockId && data.length > 0) setSelectedStockId(data[0].id);
  };

  /** Carregar produtos do estoque selecionado */
  const loadProducts = async (stockId: number) => {
    const res = await fetch(`http://localhost:4000/products?stockId=${stockId}`);
    const data: Product[] = await res.json();
    setProducts(data);
  };

  useEffect(() => { loadStocks(); }, []);
  useEffect(() => { if (selectedStockId) loadProducts(selectedStockId); }, [selectedStockId]);

  /** Adicionar produto */
  const addProduct = async () => {
    if (!newProduct.name || newProduct.quantity <= 0 || !selectedStockId) return alert("Preencha corretamente!");
    await fetch("http://localhost:4000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, stockId: selectedStockId }),
    });
    setNewProduct({ name: "", description: "", quantity: 0, stockId: 0 });
    if (selectedStockId) loadProducts(selectedStockId);
  };

  /** Editar produto */
  const updateProduct = async () => {
    if (!editingProduct) return;
    await fetch(`http://localhost:4000/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct),
    });
    setEditingProduct(null);
    if (selectedStockId) loadProducts(selectedStockId);
  };

  /** Movimentação */
  const addMovement = async (productId: number, type: "entrada" | "saida") => {
    const amount = Number(prompt(`Quantidade de ${type}:`));
    if (!amount || amount <= 0) return;

    await fetch("http://localhost:4000/products/movement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, type, amount }),
    });

    if (selectedStockId) loadProducts(selectedStockId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestão de Estoque 📦</h1>

      {/* Seleção de estoque */}
      <div className="mb-6 flex gap-4 items-center">
        <label className="font-semibold">Estoque:</label>
        <select
          value={selectedStockId || ""}
          onChange={(e) => setSelectedStockId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {stocks.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Formulário de novo produto */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Produto</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input type="text" placeholder="Nome" value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border px-3 py-2 rounded" />
          <input type="text" placeholder="Descrição" value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="Quantidade" value={newProduct.quantity || ""}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} className="border px-3 py-2 rounded" />
        </div>
        <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Adicionar</button>
      </div>

      {/* Tabela de produtos */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Produtos</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b px-4 py-2">Nome</th>
                <th className="border-b px-4 py-2">Descrição</th>
                <th className="border-b px-4 py-2">Quantidade</th>
                <th className="border-b px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{p.name}</td>
                  <td className="border-b px-4 py-2">{p.description}</td>
                  <td className="border-b px-4 py-2 text-blue-600 font-semibold">{p.quantity}</td>
                  <td className="border-b px-4 py-2 space-x-2">
                    <button onClick={() => addMovement(p.id, "entrada")} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕</button>
                    <button onClick={() => addMovement(p.id, "saida")} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">➖</button>
                    <button onClick={() => setEditingProduct(p)} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">✏️</button>
                    <button onClick={() => setHistoryProduct(p)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">📜</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edição */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Editar Produto</h2>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="text"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="number"
              value={editingProduct.quantity}
              onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <div className="flex justify-between mt-4">
              <button onClick={updateProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
              <button onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de histórico */}
      {historyProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Histórico de {historyProduct.name}</h2>
            {historyProduct.movements.length === 0 ? (
              <p className="text-gray-500">Nenhuma movimentação registrada.</p>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border-b px-4 py-2">Tipo</th>
                    <th className="border-b px-4 py-2">Quantidade</th>
                    <th className="border-b px-4 py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {historyProduct.movements.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-2">{m.type === "entrada" ? "Entrada" : "Saída"}</td>
                      <td className="border-b px-4 py-2">{m.amount}</td>
                      <td className="border-b px-4 py-2">{new Date(m.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setHistoryProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
