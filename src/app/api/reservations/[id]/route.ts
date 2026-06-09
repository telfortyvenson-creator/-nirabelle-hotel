import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// PATCH /api/reservations/:id — changer statut (checkin, checkout, annuler)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const reservation = await db.reservation.update({
    where: { id },
    data: body,
    include: { chambre: true, client: true },
  });

  // Mettre à jour le statut de la chambre selon l'action
  if (body.statut === "CHECKIN") {
    await db.chambre.update({ where: { id: reservation.chambreId }, data: { statut: "OCCUPEE" } });
  } else if (body.statut === "CHECKOUT" || body.statut === "ANNULEE") {
    await db.chambre.update({ where: { id: reservation.chambreId }, data: { statut: "DISPONIBLE" } });
  }

  return NextResponse.json(reservation);
}

// GET /api/reservations/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const reservation = await db.reservation.findUnique({
    where: { id },
    include: { chambre: true, client: true, paiements: true },
  });

  if (!reservation) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(reservation);
}
