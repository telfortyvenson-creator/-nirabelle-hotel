import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/chambres/disponibles?dateArrivee=2026-06-10&dateDepart=2026-06-12&nbPersonnes=2
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateArrivee = searchParams.get("dateArrivee");
  const dateDepart = searchParams.get("dateDepart");
  const nbPersonnes = parseInt(searchParams.get("nbPersonnes") ?? "1");

  if (!dateArrivee || !dateDepart) {
    return NextResponse.json({ error: "Dates requises" }, { status: 400 });
  }

  const arrivee = new Date(dateArrivee);
  const depart = new Date(dateDepart);

  // Trouver chambres qui ont une réservation qui chevauche ces dates
  const chambresOccupees = await db.reservation.findMany({
    where: {
      statut: { in: ["EN_ATTENTE", "CONFIRMEE", "CHECKIN"] },
      AND: [
        { dateArrivee: { lt: depart } },
        { dateDepart: { gt: arrivee } },
      ],
    },
    select: { chambreId: true },
  });

  const idsOccupes = chambresOccupees.map((r) => r.chambreId);

  const chambres = await db.chambre.findMany({
    where: {
      statut: "DISPONIBLE",
      capacite: { gte: nbPersonnes },
      id: { notIn: idsOccupes },
    },
    orderBy: [{ type: "asc" }, { numero: "asc" }],
  });

  return NextResponse.json(chambres);
}
