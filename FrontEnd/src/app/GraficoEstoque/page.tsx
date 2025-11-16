// =====================
// Gráfico real usando Recharts
// =====================


"use client";


import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";


export default function GraficoEstoque() {
const [data, setData] = useState([]);


useEffect(() => {
fetch("http://localhost:4000/items")
.then((res) => res.json())
.then((items) => {
const formatado = items.map((i: any) => ({
nome: i.nome,
quantidade: i.quantidade,
}));
setData(formatado);
});
}, []);


return (
<div className="min-h-screen bg-[#3B3030] text-white font-[Cambria]">
<Navbar />
<div className="max-w-5xl mx-auto p-6">
<h1 className="text-3xl font-bold text-center mb-8">Gráfico de Estoque</h1>


<div className="bg-[#795757] p-6 rounded-xl shadow-md">
<ResponsiveContainer width="100%" height={400}>
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="nome" stroke="#fff" />
<YAxis stroke="#fff" />
<Tooltip />
<Line type="monotone" dataKey="quantidade" stroke="#fff" strokeWidth={3} />
</LineChart>
</ResponsiveContainer>
</div>
</div>
<Footer />
</div>
);
}