import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BedDouble, Users, DollarSign, TrendingUp,
  Clock, CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";

const statutBadge: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  EN_ATTENTE:  { label: "En attente",  class: "bg-yellow-100 text-yellow-700", icon: <Clock size={12} /> },
  CONFIRMEE:   { label: "Confirmée",   class: "bg-blue-100 text-blue-700",     icon: <CheckCircle2 size={12} /> },
  CHECKIN:     { label: "Check-in",    class: "bg-green-100 text-green-700",   icon: <CheckCircle2 size={12} /> },
  CHECKOUT:    { label: "Check-out",   class: "bg-gray-100 text-gray-600",     icon: <XCircle size={12} /> },
  ANNULEE:     { label: "Annulée",     class: "bg-red-100 text-red-600",       icon: <AlertCircle size={12} /> },
};

const chambreColor: Record<string, string> = {
  DISPONIBLE:   "bg-green-100 border-green-300 text-green-700",
  OCCUPEE:      "bg-red-100 border-red-300 text-red-700",
  MAINTENANCE:  "bg-orange-100 border-orange-300 text-orange-600",
  HORS_SERVICE: "bg-gray-100 border-gray-300 text-gray-500",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalChambres,
    chambresOccupees,
    reservationsAujourdhui,
    reservationsMois,
    revenuMois,
    reservationsRecentes,
    chambres,
  ] = await Promise.all([
    db.chambre.count(),
    db.chambre.count({ where: { statut: "OCCUPEE" } }),
    db.reservation.count({
      where: {
        OR: [
          { dateArrivee: { gte: today, lt: tomorrow } },
          { statut: "CHECKIN" },
        ],
      },
    }),
    db.reservation.count({
      where: { createdAt: { gte: firstDayOfMonth }, statut: { not: "ANNULEE" } },
    }),
    db.reservation.aggregate({
      _sum: { montantPaye: true },
      where: { createdAt: { gte: firstDayOfMonth }, statut: { not: "ANNULEE" } },
    }),
    db.reservation.findMany({
      where: {
        OR: [
          { dateArrivee: { gte: today } },
          { statut: "CHECKIN" },
        ],
      },
      include: { client: true, chambre: true },
      orderBy: { dateArrivee: "asc" },
      take: 6,
    }),
    db.chambre.findMany({
      orderBy: [{ etage: "asc" }, { numero: "asc" }],
      include: {
        reservations: {
          where: { statut: "CHECKIN" },
          include: { client: true },
          take: 1,
        },
      },
    }),
  ]);

  const tauxOccupation = totalChambres > 0
    ? Math.round((chambresOccupees / totalChambres) * 100)
    : 0;

  const stats = [
    { label: "Réservations aujourd'hui", value: `${reservationsAujourdhui}`, icon: BedDouble, color: "bg-blue-50 text-blue-600", note: "arrivées + en cours" },
    { label: "Chambres occupées", value: `${chambresOccupees}/${totalChambres}`, icon: Users, color: "bg-green-50 text-green-600", note: `${tauxOccupation}% d'occupation` },
    { label: "Revenu du mois", value: `$${(revenuMois._sum.montantPaye ?? 0).toFixed(0)}`, icon: DollarSign, color: "bg-amber-50 text-amber-600", note: `${reservationsMois} réservations` },
    { label: "Taux d'occupation", value: `${tauxOccupation}%`, icon: TrendingUp, color: "bg-purple-50 text-purple-600", note: "Ce mois-ci" },
  ];

  const now = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2340]">Tableau de bord</h1>
          <p className="text-gray-400 text-sm capitalize">{now}</p>
        </div>
        <Link
          href="/admin/nouvelle-reservation"
          className="bg-[#1e3a5f] hover:bg-[#0f2340] text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          + Nouvelle réservation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className="text-xs text-gray-400">{s.note}</span>
            </div>
            <div className="text-2xl font-bold text-[#0f2340] mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Réservations récentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-[#0f2340]">Réservations à venir & en cours</h2>
            <Link href="/admin/reservations" className="text-[#1e3a5f] text-xs font-semibold hover:underline">
              Voir toutes →
            </Link>
          </div>
          <div className="divide-y">
            {reservationsRecentes.length === 0 && (
              <p className="text-center py-10 text-gray-400 text-sm">Aucune réservation</p>
            )}
            {reservationsRecentes.map((r) => {
              const s = statutBadge[r.statut];
              return (
                <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#0f2340] text-sm">
                      {r.client.prenom} {r.client.nom}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      Chambre #{r.chambre.numero} — {r.chambre.nom}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(r.dateArrivee).toLocaleDateString("fr-FR")} → {new Date(r.dateDepart).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.class}`}>
                      {s.icon} {s.label}
                    </div>
                    <div className="text-[#c9a84c] font-bold text-sm mt-1">${r.montantTotal}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vue chambres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-[#0f2340]">État des Chambres</h2>
            <Link href="/admin/chambres" className="text-[#1e3a5f] text-xs font-semibold hover:underline">
              Gérer →
            </Link>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {chambres.map((c) => {
              const clientActuel = c.reservations[0]?.client;
              return (
                <div key={c.id} className={`border rounded-xl p-3 text-xs ${chambreColor[c.statut]}`}>
                  <div className="font-bold text-base">#{c.numero}</div>
                  <div className="opacity-70">{c.type}</div>
                  {clientActuel ? (
                    <div className="font-medium mt-1 truncate">
                      {clientActuel.prenom} {clientActuel.nom[0]}.
                    </div>
                  ) : (
                    <div className="opacity-50 mt-1">
                      {c.statut === "MAINTENANCE" ? "Maintenance" : c.statut === "DISPONIBLE" ? "Libre" : c.statut}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-2 text-xs">
            {[
              { label: "Disponible",  color: "bg-green-100 text-green-700" },
              { label: "Occupée",     color: "bg-red-100 text-red-700" },
              { label: "Maintenance", color: "bg-orange-100 text-orange-600" },
            ].map((l) => (
              <span key={l.label} className={`px-2 py-0.5 rounded-full ${l.color}`}>{l.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
