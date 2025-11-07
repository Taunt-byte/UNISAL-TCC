"use client";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartsProps {
  capacidadeAtual: number;
}

export default function DashboardCharts({ capacidadeAtual }: DashboardChartsProps) {
  const capacidadeMaxima = 300; // Limite definido
  const ocupacaoPercentual = (capacidadeAtual / capacidadeMaxima) * 100;

  const dataBar = useMemo(
    () => ({
      labels: ["Capacidade Atual"],
      datasets: [
        {
          label: "Itens em Estoque",
          data: [capacidadeAtual],
          backgroundColor: "#1d06ecff",
          borderRadius: 10,
        },
        {
          label: "Capacidade Máxima (300)",
          data: [capacidadeMaxima],
          backgroundColor: "#05aa37ff",
        },
      ],
    }),
    [capacidadeAtual]
  );

  const dataLine = useMemo(
    () => ({
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Evolução de Estoque",
          data: [100, 150, 200, 180, 250, capacidadeAtual],
          borderColor: "#795757",
          backgroundColor: "#795757",
          fill: true,
          tension: 0.4,
        },
      ],
    }),
    [capacidadeAtual]
  );

  return (
    <div
      className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-violet-800"
      style={{
        color: "white",
        fontFamily: "Cambria",
      }}
    >
      {/* Gráfico de Barras */}
      <div className="rounded-2xl shadow-md p-4" style={{ backgroundColor: "#ffffffff" }}>
        <h2 className="text-xl text-black font-semibold mb-4 text-center">Capacidade do Armazém</h2>
        <Bar data={dataBar} />
        <p className="mt-4 text-center text-black font-medium">
          Ocupação: {ocupacaoPercentual.toFixed(1)}%
        </p>
      </div>

      {/* Gráfico de Linha */}
      <div className="rounded-2xl shadow-md p-4 text-black" style={{ backgroundColor: "#ffffffff" }}>
        <h2 className="text-xl font-semibold mb-4 text-center text-black">Evolução de Itens no Tempo</h2>
        <Line data={dataLine} />
      </div>
    </div>
  );
}
