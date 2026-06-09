"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, CheckCircle, XCircle, Wrench, AlertCircle } from "lucide-react";

type Chambre = {
  id: string; numero: string; type: string; nom: string;
  prix: number; capacite: number; superficie: number | null;
  etage: number; statut: string;
};

const statutConfig: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  DISPONIBLE:   { label: "Disponible",   class: "bg-green-100 text-green-700",   icon: <CheckCircle size={13} /> },
  OCCUPEE:      { label: "Occupée",      class: "bg-red-100 text-red-600",       icon: <XCircle size={13} /> },
  MAINTENANCE:  { label: "Maintenance",  class: "bg-orange-100 text-orange-600", icon: <Wrench size={13} /> },
  HORS_SERVICE: { label: "Hors service", class: "bg-gray-100 text-gray-500",     icon: <AlertCircle size={13} /> },
};

const statuts = ["DISPONIBLE", "OCCUPEE", "MAINTENANCE", "HORS_SERVICE"];

export default function ChambresClient({ chambres: initial }: { chambres: Chambre[] }) {
  const router = useRouter();
  const [chambres, setChambres] = useState(initial);
  const [filter, setFilter] = useState("Toutes");
  const [updating, setUpdating] = useState<string | null>(null);

  const changeStatut = async (id: string, statut: string) => {
    setUpdating(id);
    setChambres((prev) => prev.map((c) => c.id === id ? { ...c, statut } : c));
    await fetch(`/api/chambres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    setUpdating(null);
    router.refresh();
  };

  const counts = {
    disponibles: chambres.filter((c) => c.statut === "DISPONIBLE").length,
    occupees: chambres.filter((c) => c.statut === "OCCUPEE").length,
    maintenance: chambres.filter((c) => c.statut === "MAINTENANCE").length,
  };

  const filtered = filter === "Toutes" ? chambres : chambres.filter((c) => c.statut === filter);

  return (
    <div className="space-y-5">
      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Disponibles", val: counts.disponibles, color: "text-green-600 bg-green-50" },
          { label: "Occupées",    val: counts.occupees,    color: "text-red-600 bg-red-50" },
          { label: "Maintenance", val: counts.maintenance, color: "text-orange-600 bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <div className="text-3xl font-bold">{s.val}</div>
            <div className="text-sm font-medium opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {["Toutes", ...statuts].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${filter === f ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            {f === "Toutes" ? "Toutes" : statutConfig[f]?.label}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Chambre</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Étage</th>
              <th className="px-5 py-3 text-left">Capacité</th>
              <th className="px-5 py-3 text-left">Superficie</th>
              <th className="px-5 py-3 text-left">Prix/nuit</th>
              <th className="px-5 py-3 text-left">Statut</th>
              <th className="px-5 py-3 text-left">Changer statut</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => {
              const s = statutConfig[c.statut] ?? { label: c.statut, class: "bg-gray-100 text-gray-600", icon: null };
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#0f2340]">#{c.numero}</div>
                    <div className="text-gray-400 text-xs">{c.nom}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.type}</td>
                  <td className="px-5 py-4 text-gray-600">{c.etage}</td>
                  <td className="px-5 py-4 text-gray-600">{c.capacite} pers.</td>
                  <td className="px-5 py-4 text-gray-600">{c.superficie ?? "-"} m²</td>
                  <td className="px-5 py-4 font-bold text-[#c9a84c]">${c.prix}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.class}`}>
                      {s.icon} {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={c.statut}
                      disabled={updating === c.id}
                      onChange={(e) => changeStatut(c.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#1e3a5f] disabled:opacity-50"
                    >
                      {statuts.map((st) => (
                        <option key={st} value={st}>{statutConfig[st].label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-gray-400 hover:text-[#1e3a5f] p-1 rounded">
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
