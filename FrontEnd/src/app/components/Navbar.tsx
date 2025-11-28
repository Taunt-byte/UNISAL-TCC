"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 evita erro de hidratação
  if (!mounted) return null;

  return (
    <div className="bg-violet-800 text-white shadow-md font-[Cambria]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          NexGestor
        </Link>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/EstoquePage" className="hover:text-gray-300">Início</Link>
          <Link href="/Sobre" className="hover:text-gray-300">Sobre</Link>
          <Link href="/Contato" className="hover:text-gray-300">Contato</Link>
        </div>

        {/* BOTÃO MOBILE */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>
    </div>
  );
}
