"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Chambre = { id: string; numero: string; type: string; nom: string };
type Reservation = {
  id: string;
  chambreId: string;
  dateArrivee: Date | string;
  dateDepart:  Date | string;
  statut: string;
  client: { prenom: string; nom: string };
};

const COLORS = [
  "bg-blue-400",   "bg-purple-400", "bg-pink-400",
  "bg-teal-400",   "bg-orange-400", "bg-indigo-400",
  "bg-rose-400",   "bg-cyan-400",   "bg-emerald-400",
  "bg-amber-400",
];

export default function CalendrierClient({
  chambres,
  reservations,
}: {
  chambres: Chambre[];
  reservations: Reservation[];
}) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = new Date(year, month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  // Assign a stable color per reservation
  const colorMap: Record<string, string> = {};
  reservations.forEach((r, i) => { colorMap[r.id] = COLORS[i % COLORS.length]; });

  const getResaForCell = (chambreId: string, day: number) => {
    const cellDate = new Date(year, month, day);
    return reservations.find((r) => {
      if (r.chambreId !== chambreId) return false;
      const start = new Date(r.dateArrivee);
      const end   = new Date(r.dateDepart);
      start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0); cellDate.setHours(0, 0, 0, 0);
      return cellDate >= start && cellDate < end;
    });
  };

  const isFirst = (resa: Reservation, day: number) => {
    const startDay = new Date(resa.dateArrivee);
    return startDay.getDate() === day && startDay.getMonth() === month && startDay.getFullYear() === year;
  };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2340]">Calendrier des Réservations</h1>
          <p className="text-gray-400 text-sm">Vue par chambre et par jour</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl border border-gray-200 hover:border-[#1e3a5f] text-gray-500 hover:text-[#1e3a5f] transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-[#0f2340] capitalize min-w-[160px] text-center">{monthName}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl border border-gray-200 hover:border-[#1e3a5f] text-gray-500 hover:text-[#1e3a5f] transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-4 h-3 rounded bg-green-100 border border-green-300 inline-block" /> Disponible</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-3 rounded bg-blue-400 inline-block" /> Réservé / Check-in</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-3 rounded border-2 border-[#c9a84c] inline-block" /> Aujourd&apos;hui</span>
      </div>

      {/* Grille */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[#0f2340] text-white">
              <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-[#0f2340] z-10 min-w-[130px]">
                Chambre
              </th>
              {days.map((d) => (
                <th key={d} className={`w-9 py-3 text-center font-medium ${isToday(d) ? "bg-[#c9a84c] text-[#0f2340]" : ""}`}>
                  <div>{d}</div>
                  <div className="text-[10px] opacity-60">
                    {new Date(year, month, d).toLocaleDateString("fr-FR", { weekday: "short" })[0].toUpperCase()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chambres.map((c, idx) => (
              <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className={`px-4 py-2 sticky left-0 z-10 font-semibold border-r border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="text-[#0f2340]">#{c.numero}</div>
                  <div className="text-gray-400 font-normal">{c.type}</div>
                </td>
                {days.map((d) => {
                  const resa = getResaForCell(c.id, d);
                  const color = resa ? colorMap[resa.id] : null;
                  const firstDay = resa ? isFirst(resa, d) : false;
                  return (
                    <td
                      key={d}
                      title={resa ? `${resa.client.prenom} ${resa.client.nom}` : "Disponible"}
                      className={`h-10 border border-gray-50 text-center cursor-pointer transition-colors
                        ${isToday(d) ? "border-l border-r border-[#c9a84c]" : ""}
                        ${color ? `${color} text-white` : "hover:bg-blue-50"}`}
                    >
                      {firstDay && resa && (
                        <span className="text-[9px] font-bold px-0.5 truncate block leading-10">
                          {resa.client.prenom[0]}.{resa.client.nom.slice(0, 5)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
