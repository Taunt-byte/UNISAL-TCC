"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen font-[Cambria] bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-violet-800 text-white py-20 px-6 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre o NexGestor</h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          Uma solução moderna e eficiente para o controle de estoque de pequenas empresas.
        </p>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-grow px-6 py-16 max-w-5xl mx-auto space-y-16">

        {/* MISSÃO */}
        <section className="bg-white p-8 rounded-2xl shadow-xl border">
          <h2 className="text-3xl font-bold text-violet-800 mb-4">Nossa Missão</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O NexGestor nasceu com o objetivo de trazer praticidade e eficiência 
            para pequenas empresas que desejam melhorar seu controle de estoque. 
            Com uma interface simples e um sistema robusto, ajudamos negócios a 
            evitar perdas, organizar produtos e tomar decisões mais seguras.
          </p>
        </section>

        {/* VALORES */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold text-violet-700 mb-2">Eficiência</h3>
            <p className="text-gray-600">
              Processos rápidos, interface otimizada e informações claras.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold text-violet-700 mb-2">Confiabilidade</h3>
            <p className="text-gray-600">
              Dados seguros, operações estáveis e gestão responsável.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold text-violet-700 mb-2">Inovação</h3>
            <p className="text-gray-600">
              Evolução constante para acompanhar as necessidades do mercado.
            </p>
          </div>
        </section>

        {/* SOBRE O PROJETO */}
        <section className="bg-white p-8 rounded-2xl shadow-xl border">
          <h2 className="text-3xl font-bold text-violet-800 mb-4">O Projeto</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O NexGestor foi desenvolvido a partir da necessidade real de micro e 
            pequenos empreendedores que sofrem com a falta de organização em 
            estoque, dificuldade para registrar entradas e saídas e ausência de 
            relatórios que auxiliem no planejamento estratégico.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Nosso sistema oferece funcionalidades essenciais como cadastro de 
            produtos, acompanhamento de movimentações, alertas de baixo estoque 
            e relatórios visuais que facilitam a tomada de decisões.
          </p>
        </section>

        {/* SOBRE O DESENVOLVEDOR */}
        <section className="bg-violet-800 text-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Sobre o Desenvolvedor</h2>
          <p className="leading-relaxed text-lg">
            O sistema foi criado por <strong>Lucas Neves</strong>, desenvolvedor
            apaixonado por soluções tecnológicas eficientes e acessíveis. 
            Atualmente atua no desenvolvimento web com foco em sistemas modernos
            que facilitem o dia a dia das empresas.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
