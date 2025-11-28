"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProdutosPage() {
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [armazens, setArmazens] = useState([]);

  const [busca, setBusca] = useState("");
  const [filtroArmazem, setFiltroArmazem] = useState("");
  const [qtdMin, setQtdMin] = useState("");
  const [qtdMax, setQtdMax] = useState("");

  const [ordem, setOrdem] = useState({ coluna: "", direcao: "" });

  const [detalhe, setDetalhe] = useState<any>(null);
  const [editando, setEditando] = useState<any>(null);

  // ==========================
  // Carregar produtos + armazéns
  // ==========================
  useEffect(() => {
    carregarProdutos();
    fetch("http://localhost:4000/armazens")
      .then((r) => r.json())
      .then((dados) => setArmazens(dados));
  }, []);

  function carregarProdutos() {
    fetch("http://localhost:4000/items")
      .then((r) => r.json())
      .then((dados) => {
        setTodosProdutos(dados);
        setProdutos(dados);
      });
  }

  // ==========================
  // Filtro automatizado
  // ==========================
  useEffect(() => {
    filtrarProdutos();
  }, [busca, filtroArmazem, qtdMin, qtdMax, ordem]);

  // Função de filtro principal
  function filtrarProdutos() {
    let lista = [...todosProdutos];

    // FILTRAR POR NOME
    if (busca.trim() !== "") {
      lista = lista.filter((p: any) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // FILTRAR POR ARMAZÉM
    if (filtroArmazem.trim() !== "") {
      lista = lista.filter((p: any) => p.armazem === filtroArmazem);
    }

    // QUANTIDADE MÍNIMA
    if (qtdMin) {
      lista = lista.filter((p: any) => p.quantidade >= Number(qtdMin));
    }

    // QUANTIDADE MÁXIMA
    if (qtdMax) {
      lista = lista.filter((p: any) => p.quantidade <= Number(qtdMax));
    }

    // ORDENAR
    if (ordem.coluna !== "") {
      lista.sort((a: any, b: any) => {
        const dir = ordem.direcao === "asc" ? 1 : -1;

        if (ordem.coluna === "nome" || ordem.coluna === "armazem") {
          return a[ordem.coluna].localeCompare(b[ordem.coluna]) * dir;
        }

        return (a[ordem.coluna] - b[ordem.coluna]) * dir;
      });
    }

    setProdutos(lista);
  }

  // ==========================
  // Alternar ordenação
  // ==========================
  function ordenarPor(coluna: string) {
    setOrdem((prev) => {
      if (prev.coluna !== coluna) {
        return { coluna, direcao: "asc" };
      }
      if (prev.direcao === "asc") return { coluna, direcao: "desc" };
      return { coluna: "", direcao: "" }; // sem ordenação
    });
  }

  // ==========================
  // Excluir produto
  // ==========================
  async function excluirProduto(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    await fetch(`http://localhost:4000/items/${id}`, {
      method: "DELETE",
    });

    carregarProdutos();
  }

  // ==========================
  // Salvar edição
  // ==========================
  function salvarAlteracoes(e: any) {
    e.preventDefault();

    fetch(`http://localhost:4000/items/${editando._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editando),
    }).then(() => {
      setEditando(null);
      carregarProdutos();
    });
  }

  // ==========================================================
  // =========================== JSX ===========================
  // ==========================================================
  return (
    <div className="min-h-screen bg-white text-black font-[Cambria]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">
          Gestão de Produtos
        </h1>

        {/* ===================== FILTROS ===================== */}
        <div className="bg-purple-100 p-5 rounded-xl shadow-md mb-6 border border-purple-300 flex flex-wrap gap-4">

          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="p-2 rounded border border-purple-300 flex-1"
          />

          <select
            value={filtroArmazem}
            onChange={(e) => setFiltroArmazem(e.target.value)}
            className="p-2 rounded border border-purple-300"
          >
            <option value="">Todos armazéns</option>
            {armazens.map((a: any) => (
              <option key={a._id} value={a.nome}>
                {a.nome}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qtd. mín."
            value={qtdMin}
            onChange={(e) => setQtdMin(e.target.value)}
            className="p-2 rounded border border-purple-300 w-32"
          />

          <input
            type="number"
            placeholder="Qtd. máx."
            value={qtdMax}
            onChange={(e) => setQtdMax(e.target.value)}
            className="p-2 rounded border border-purple-300 w-32"
          />
        </div>

        {/* ===================== TABELA ===================== */}
        <div className="bg-purple-100 p-6 rounded-xl shadow-md border border-purple-300 overflow-x-auto">

          <table className="w-full">
            <thead>
              <tr className="text-left text-purple-700 font-bold">

                <th
                  className="cursor-pointer"
                  onClick={() => ordenarPor("nome")}
                >
                  Nome {ordem.coluna === "nome" && (ordem.direcao === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="cursor-pointer"
                  onClick={() => ordenarPor("quantidade")}
                >
                  Qtd. {ordem.coluna === "quantidade" && (ordem.direcao === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="cursor-pointer"
                  onClick={() => ordenarPor("armazem")}
                >
                  Armazém {ordem.coluna === "armazem" && (ordem.direcao === "asc" ? "↑" : "↓")}
                </th>

                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((p: any) => (
                <tr key={p._id} className="border-t border-purple-300/40">
                  <td className="py-2">{p.nome}</td>
                  <td>{p.quantidade}</td>
                  <td>{p.armazem}</td>

                  <td className="flex gap-3 py-2">

                    <button
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
                      onClick={() => setDetalhe(p)}
                    >
                      Ver
                    </button>

                    <button
                      className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition"
                      onClick={() => setEditando(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => excluirProduto(p._id)}
                    >
                      Excluir
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />

      {/* ============== MODAL DE DETALHES ============== */}
      {detalhe && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-purple-100 p-6 rounded-xl w-full max-w-md border border-purple-300 text-black">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Detalhes do Produto
            </h2>

            <p><strong>Nome:</strong> {detalhe.nome}</p>
            <p><strong>Quantidade:</strong> {detalhe.quantidade}</p>
            <p><strong>Descrição:</strong> {detalhe.descricao}</p>
            <p><strong>Armazém:</strong> {detalhe.armazem}</p>
            <p><strong>Custo:</strong> R$ {detalhe.custo}</p>

            <button
              className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              onClick={() => setDetalhe(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ============== MODAL DE EDIÇÃO ============== */}
      {editando && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <form
            onSubmit={salvarAlteracoes}
            className="bg-purple-100 p-6 text-black rounded-xl border border-purple-300 w-full max-w-lg flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-purple-700">
              Editar Produto
            </h2>

            <label>
              Nome:
              <input
                className="w-full p-2 rounded border border-purple-400"
                value={editando.nome}
                onChange={(e) =>
                  setEditando({ ...editando, nome: e.target.value })
                }
              />
            </label>

            <label>
              Quantidade:
              <input
                type="number"
                className="w-full p-2 rounded border border-purple-400"
                value={editando.quantidade}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    quantidade: Number(e.target.value),
                  })
                }
              />
            </label>

            <label>
              Custo:
              <input
                type="number"
                className="w-full p-2 rounded border border-purple-400"
                value={editando.custo}
                onChange={(e) =>
                  setEditando({ ...editando, custo: Number(e.target.value) })
                }
              />
            </label>

            <label>
              Armazém:
              <select
                className="w-full p-2 rounded border border-purple-400"
                value={editando.armazem}
                onChange={(e) =>
                  setEditando({ ...editando, armazem: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {armazens.map((a: any) => (
                  <option key={a._id} value={a.nome}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Descrição:
              <textarea
                rows={4}
                className="w-full p-2 rounded border border-purple-400"
                value={editando.descricao}
                onChange={(e) =>
                  setEditando({ ...editando, descricao: e.target.value })
                }
              />
            </label>

            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
