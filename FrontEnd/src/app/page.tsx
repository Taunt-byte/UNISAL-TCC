import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-4">Sistema de Controle de Estoque</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Organize, acompanhe e otimize sua gestão de produtos com praticidade e segurança.
        </p>
        <div className="mt-8">
          <Link href="/LoginPage">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
              Acessar o Sistema
            </button>
          </Link>
        </div>
        <div>
          <Link href="/GestaoPage">
            <button className="mt-4 px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
              Gestão de Usuários
            </button>
          </Link>
        </div>
      </header>

      {/* Features */}
      <main className="flex-1 py-20 px-8 grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Image src="/icons/inventory.svg" alt="Ícone estoque" width={50} height={50} />
          <h2 className="text-xl font-semibold mt-4">Gestão de Produtos</h2>
          <p className="mt-2 text-gray-600">
            Cadastre, edite e acompanhe os itens do seu estoque em tempo real.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Image src="/icons/analytics.svg" alt="Ícone relatórios" width={50} height={50} />
          <h2 className="text-xl font-semibold mt-4">Relatórios Inteligentes</h2>
          <p className="mt-2 text-gray-600">
            Visualize métricas detalhadas para apoiar decisões estratégicas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Image src="/icons/security.svg" alt="Ícone segurança" width={50} height={50} />
          <h2 className="text-xl font-semibold mt-4">Segurança Garantida</h2>
          <p className="mt-2 text-gray-600">
            Seus dados são protegidos com autenticação segura e backups automáticos.
          </p>
        </div>
      </main>
    </div>
  );
}
