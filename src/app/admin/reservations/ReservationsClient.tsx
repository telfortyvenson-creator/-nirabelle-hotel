"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Clock, CheckCircle2, XCircle, AlertCircle, Eye, LogIn, LogOut, Ban } from "lucide-react";

type Reservation = {
  id: string;
  statut: string;
  source: string;
  montantTotal: number;
  montantPaye: number;
  dateArrivee: Date | string;
  dateDepart: Date | string;
  client: { prenom: string; nom: string; email: string };
  chambre: { numero: string; nom: string };
};

const tabs = [
  { label: "Toutes", filter: null },
  { label: "Aujourd'hui", filter: "TODAY" },
  { label: "En cours", filter: "CHECKIN" },
  { label: "Confirmées", filter: "CONFIRMEE" },
  { label: "En attente", filter: "EN_ATTENTE" },
  { label: "Annulées", filter: "ANNULEE" },
];

const statutBadge: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  EN_ATTENTE: { label: "En attente", class: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
  CONFIRMEE:  { label: "Confirmée",  class: "bg-blue-100 text-blue-700",    icon: <CheckCircle2 size={11} /> },
  CHECKIN:    { label: "Check-in",   class: "bg-green-100 text-green-700",  icon: <CheckCircle2 size={11} /> },
  CHECKOUT:   { label: "Check-out",  class: "bg-gray-100 text-gray-600",    icon: <XCircle size={11} /> },
  ANNULEE:    { label: "Annulée",    class: "bg-red-100 text-red-600",      icon: <AlertCircle size={11} /> },
};

const sourceLabel: Record<string, string> = {
  EN_LIGNE: "En ligne", SUR_PLACE: "Sur place", TELEPHONE: "Tél.",
};

export default function ReservationsClient({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const filtered = reservations.filter((r) => {
    const matchSearch =
      `${r.client.prenom} ${r.client.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      r.chambre.numero.includes(search) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "TODAY") {
      const arrivee = new Date(r.dateArrivee).toISOString().split("T")[0];
      const depart  = new Date(r.dateDepart).toISOString().split("T")[0];
      return arrivee === todayStr || depart === todayStr || r.statut === "CHECKIN";
    }
    if (activeTab) return r.statut === activeTab;
    return true;
  });

  const changeStatut = async (id: string, statut: string) => {
    setLoading(id);
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.filter)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.filter ? "border-b-2 border-[#1e3a5f] text-[#1e3a5f]" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-4 border-b flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par client, chambre, N° réservation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-gray-400">
          <Filter size={15} /> Filtrer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Client</th>
              <th className="px-5 py-3 text-left">Chambre</th>
              <th className="px-5 py-3 text-left">Arrivée</th>
              <th className="px-5 py-3 text-left">Départ</th>
              <th className="px-5 py-3 text-left">Source</th>
              <th className="px-5 py-3 text-left">Statut</th>
              <th className="px-5 py-3 text-right">Montant</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((r) => {
              const s = statutBadge[r.statut] ?? { label: r.statut, class: "bg-gray-100 text-gray-600", icon: null };
              const isLoading = loading === r.id;
              return (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#0f2340]">{r.client.prenom} {r.client.nom}</div>
                    <div className="text-gray-400 text-xs">{r.client.email}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">#{r.chambre.numero}</td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{new Date(r.dateArrivee).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{new Date(r.dateDepart).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{sourceLabel[r.source] ?? r.source}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.class}`}>
                      {s.icon} {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="font-bold text-[#c9a84c]">${r.montantTotal}</div>
                    {r.montantPaye > 0 && (
                      <div className="text-green-500 text-xs">Payé: ${r.montantPaye}</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {r.statut === "CONFIRMEE" && (
                        <button onClick={() => changeStatut(r.id, "CHECKIN")} disabled={isLoading} title="Check-in"
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 transition-colors">
                          <LogIn size={14} />
                        </button>
                      )}
                      {r.statut === "CHECKIN" && (
                        <button onClick={() => changeStatut(r.id, "CHECKOUT")} disabled={isLoading} title="Check-out"
                          className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 disabled:opacity-50 transition-colors">
                          <LogOut size={14} />
                        </button>
                      )}
                      {(r.statut === "EN_ATTENTE" || r.statut === "CONFIRMEE") && (
                        <button onClick={() => changeStatut(r.id, "ANNULEE")} disabled={isLoading} title="Annuler"
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors">
                          <Ban size={14} />
                        </button>
                      )}
                      <button title="Voir détails" className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucune réservation trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
