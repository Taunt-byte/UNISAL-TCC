import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-violet-800 text-white py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sobre */}
        <div>
          <h2 className="text-lg font-semibold mb-4">NexGestor</h2>
          <p className="text-gray-300 text-sm">
            Sistema moderno de controle de estoque para empresas que buscam
            eficiência, segurança e praticidade na gestão de seus produtos.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Navegação</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Início
              </Link>
            </li>
            <li>
              <Link href="/LoginPage" className="hover:underline">
                Acessar Sistema
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:underline">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:underline">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contato</h2>
          <p className="text-sm text-gray-300">📍 São Paulo - SP</p>
          <p className="text-sm text-gray-300">📧 contato@nexgestor.com</p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="border-t border-violet-700 mt-8 pt-4 text-center text-sm text-gray-400">
        <p>&copy; 2024 NexGestor. Todos os direitos reservados.</p>
        <p>Desenvolvido pela Equipe NexGestor</p>
      </div>
    </footer>
  );
}
