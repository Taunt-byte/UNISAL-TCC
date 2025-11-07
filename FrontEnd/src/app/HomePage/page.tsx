
import Link from "next/link";

/**
 * Página Inicial - Sistema de Controle de Estoque
 */
export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="bg-white py-20 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Sistema de Controle de Estoque
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
          Organize, acompanhe e otimize sua gestão de produtos com praticidade e
          segurança.
        </p>

        {/* Botão de acesso */}
        <div className="mt-10">
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl shadow hover:bg-violet-700 transition duration-300"
          >
            Acessar o Sistema
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <main className="flex-grow bg-violet-800">
        <section className="max-w-6xl mx-auto py-20 px-6 grid gap-12 md:grid-cols-3">
          {/* Card: Gestão de Produtos */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mt-4">Gestão de Produtos</h2>
            <p className="mt-2 text-gray-600">
              Cadastre, edite e acompanhe os itens do seu estoque em tempo real.
            </p>
          </div>

          {/* Card: Relatórios */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mt-4">
              Relatórios Inteligentes
            </h2>
            <p className="mt-2 text-gray-600">
              Visualize métricas detalhadas para apoiar decisões estratégicas.
            </p>
          </div>

          {/* Card: Segurança */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold mt-4">Segurança Garantida</h2>
            <p className="mt-2 text-gray-600">
              Seus dados são protegidos com autenticação segura e backups
              automáticos.
            </p>
          </div>
        </section>
      </main>
      {/* Sessão de Comentários */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            O que nossos clientes dizem 💬
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-violet-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-gray-700 italic">
                "O sistema facilitou muito a gestão do meu mercado! Consigo
                acompanhar tudo em tempo real."
              </p>
              <div className="mt-4 flex items-center justify-center">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Marcos Silva</p>
                  <p className="text-gray-500 text-sm">Dono de Mercado</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-violet-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-gray-700 italic">
                "Prático e seguro. Nunca mais perdi controle do meu estoque!"
              </p>
              <div className="mt-4 flex items-center justify-center">
                <img
                  src="https://i.pravatar.cc/100?img=5"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Ana Costa</p>
                  <p className="text-gray-500 text-sm">Empresária</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-violet-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-gray-700 italic">
                "A interface é muito intuitiva, minha equipe aprendeu em poucos
                minutos."
              </p>
              <div className="mt-4 flex items-center justify-center">
                <img
                  src="https://i.pravatar.cc/100?img=8"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">João Pereira</p>
                  <p className="text-gray-500 text-sm">Gestor de Logística</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
