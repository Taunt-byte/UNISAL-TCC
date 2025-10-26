"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");

  const handleRegister = async(e:React.FormEvent)=>{
    e.preventDefault();
    setError(""); setMessage("");
    if(password!==confirm){ setError("Senhas não coincidem"); return; }

    try{
      const res = await fetch("http://localhost:4000/auth/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      setMessage("Cadastro realizado!");
      setTimeout(()=>router.push("/login"),2000);
    }catch(err:any){ setError(err.message) }
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

          <form onSubmit={handleRegister} className="space-y-5">
            <input type="email" placeholder="E-mail" value={email}
              onChange={(e)=>setEmail(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg"/>
            <input type="password" placeholder="Senha" value={password}
              onChange={(e)=>setPassword(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg"/>
            <input type="password" placeholder="Confirmar Senha" value={confirm}
              onChange={(e)=>setConfirm(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg"/>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Registrar</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
