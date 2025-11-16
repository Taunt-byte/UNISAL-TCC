"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("E-mail de recuperação enviado!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Enviar e-mail de recuperação
            </button>
          </form>

          {/* Links extras */}
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => router.push("/Login")}
              className="text-blue-600 hover:underline"
            >
              Voltar para o login
            </button>

            <br />

            <button
              onClick={() => router.push("/register")}
              className="text-gray-700 hover:underline"
            >
              Criar uma nova conta
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
