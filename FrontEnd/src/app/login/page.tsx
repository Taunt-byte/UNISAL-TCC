"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      auth?.loginUser(data.user);

      router.push("/EstoquePage");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Entrar
            </button>
          </form>
          <Link
            href="/reset-password"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Esqueci minha senha
          </Link>
          <Link 
            href="/register"
            className="block mt-2 text-center text-blue-600 hover:underline"
          >
            Criar uma nova conta
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
