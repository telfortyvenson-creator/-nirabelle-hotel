import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalChambres,
    chambresOccupees,
    chambresDisponibles,
    reservationsAujourdhui,
    reservationsMois,
    revenuMois,
    reservationsRecentes,
    chambresStatut,
  ] = await Promise.all([
    db.chambre.count(),
    db.chambre.count({ where: { statut: "OCCUPEE" } }),
    db.chambre.count({ where: { statut: "DISPONIBLE" } }),
    db.reservation.count({
      where: {
        OR: [
          { dateArrivee: { gte: today, lt: tomorrow } },
          { dateDepart: { gte: today, lt: tomorrow } },
          { statut: "CHECKIN" },
        ],
      },
    }),
    db.reservation.count({
      where: {
        createdAt: { gte: firstDayOfMonth },
        statut: { not: "ANNULEE" },
      },
    }),
    db.reservation.aggregate({
      _sum: { montantPaye: true },
      where: {
        createdAt: { gte: firstDayOfMonth },
        statut: { not: "ANNULEE" },
      },
    }),
    db.reservation.findMany({
      where: {
        OR: [
          { dateArrivee: { gte: today, lt: tomorrow } },
          { statut: "CHECKIN" },
          { dateArrivee: { gte: today } },
        ],
      },
      include: { client: true, chambre: true },
      orderBy: { dateArrivee: "asc" },
      take: 8,
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

  return NextResponse.json({
    stats: {
      reservationsAujourdhui,
      reservationsMois,
      revenuMois: revenuMois._sum.montantPaye ?? 0,
      tauxOccupation,
      totalChambres,
      chambresOccupees,
      chambresDisponibles,
    },
    reservationsRecentes,
    chambresStatut,
  });
}
