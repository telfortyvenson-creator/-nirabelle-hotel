import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalendrierClient from "./CalendrierClient";

export default async function CalendrierPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay  = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const [chambres, reservations] = await Promise.all([
    db.chambre.findMany({ orderBy: [{ etage: "asc" }, { numero: "asc" }] }),
    db.reservation.findMany({
      where: {
        statut: { in: ["EN_ATTENTE", "CONFIRMEE", "CHECKIN"] },
        AND: [
          { dateArrivee: { lt: lastDay } },
          { dateDepart:  { gt: firstDay } },
        ],
      },
      include: { client: true },
    }),
  ]);

  return <CalendrierClient chambres={chambres} reservations={reservations} />;
}
