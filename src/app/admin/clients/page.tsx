import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientsClient from "./ClientsClient";

export default async function ClientsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const clients = await db.client.findMany({
    include: {
      _count: { select: { reservations: true } },
      reservations: {
        select: { montantTotal: true, dateArrivee: true, statut: true },
        orderBy: { dateArrivee: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculer les totaux
  const clientsWithTotals = clients.map((c) => ({
    ...c,
    totalDepense: c.reservations
      .filter((r) => r.statut !== "ANNULEE")
      .reduce((sum, r) => sum + r.montantTotal, 0),
    dernierSejour: c.reservations[0]?.dateArrivee ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2340]">Clients</h1>
        <p className="text-gray-400 text-sm">{clients.length} clients enregistrés</p>
      </div>
      <ClientsClient clients={clientsWithTotals} />
    </div>
  );
}
