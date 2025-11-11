"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      router.push("/EstoquePage");
    } catch(err:any) { setError(err.message) }
  };

  const handleForgot = async () => {
    if (!email) { setError("Digite seu e-mail"); return; }
    setError(""); setMessage("");

    try {
      const res = await fetch("http://localhost:4000/auth/reset", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("E-mail de recuperação enviado!");
    } catch(err:any) { setError(err.message) }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <input type="email" placeholder="E-mail" value={email}
              onChange={(e)=>setEmail(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg"/>
            <input type="password" placeholder="Senha" value={password}
              onChange={(e)=>setPassword(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg"/>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Entrar</button>
          </form>

          <div className="flex justify-between mt-4">
            <button onClick={handleForgot} className="text-blue-600 hover:underline text-sm">Esqueci a senha</button>
            <a href="/register" className="text-blue-600 hover:underline text-sm">Cadastre-se</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
