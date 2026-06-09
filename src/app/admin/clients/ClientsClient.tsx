"use client";

import { useState } from "react";
import { Search, User, Eye } from "lucide-react";

type Client = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  nationalite: string | null;
  _count: { reservations: number };
  totalDepense: number;
  dernierSejour: Date | string | null;
};

export default function ClientsClient({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      `${c.prenom} ${c.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.telephone ?? "").includes(search)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-5 py-3 text-left">Client</th>
            <th className="px-5 py-3 text-left">Contact</th>
            <th className="px-5 py-3 text-left">Nationalité</th>
            <th className="px-5 py-3 text-left">Séjours</th>
            <th className="px-5 py-3 text-left">Dernier séjour</th>
            <th className="px-5 py-3 text-right">Total dépensé</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                    <User size={16} className="text-[#1e3a5f]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0f2340]">{c.prenom} {c.nom}</div>
                    <div className="text-gray-400 text-xs">{c.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-gray-600">{c.telephone ?? "—"}</td>
              <td className="px-5 py-4 text-gray-600">{c.nationalite ?? "—"}</td>
              <td className="px-5 py-4">
                <span className="bg-[#1e3a5f]/10 text-[#1e3a5f] font-bold text-xs px-2 py-1 rounded-full">
                  {c._count.reservations} séjour{c._count.reservations > 1 ? "s" : ""}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-600 text-xs">
                {c.dernierSejour
                  ? new Date(c.dernierSejour).toLocaleDateString("fr-FR")
                  : "—"}
              </td>
              <td className="px-5 py-4 text-right font-bold text-[#c9a84c]">
                ${c.totalDepense.toFixed(0)}
              </td>
              <td className="px-5 py-4">
                <button className="text-gray-400 hover:text-[#1e3a5f] p-1 rounded">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <User size={32} className="mx-auto mb-3 opacity-30" />
          <p>Aucun client trouvé</p>
        </div>
      )}
    </div>
  );
}
