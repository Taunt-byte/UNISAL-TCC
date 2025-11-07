export interface Item {
  _id: string;
  nome: string;
  quantidade: number;
  status: "Pronto" | "Em andamento" | "Parado";
  custo: number;
  dataChegada?: string;
  createdAt?: string;
}

export const getDatePart = (iso?: string | null, fallbackIso?: string | null) => {
  const s = iso ?? fallbackIso;
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s.split?.("T")?.[0] ?? s;
};
