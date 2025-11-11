"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-violet-800 text-white shadow-md font-[Cambria]">
      <div className="h-2 bg-violet-800">

      </div>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          NexGestor
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Início
          </Link>
          <Link
            href="/Sobre"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Sobre
          </Link>
          <Link href="/Contato" className="hover:text-gray-300">
            Contato
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-violet-700 px-6 py-4 space-y-3">
          <Link
            href="/"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Início
          </Link>
          <Link
            href="/Sobre"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Sobre
          </Link>
          <Link
            href="/Contato"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Contato
          </Link>
        </div>
      )}
    </div>
  );
}
