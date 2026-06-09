import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/reservations — liste (admin seulement)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const statut = searchParams.get("statut");
  const search = searchParams.get("search");

  const reservations = await db.reservation.findMany({
    where: {
      ...(statut && statut !== "TOUTES" ? { statut: statut as never } : {}),
      ...(search
        ? {
            OR: [
              { client: { nom: { contains: search, mode: "insensitive" } } },
              { client: { prenom: { contains: search, mode: "insensitive" } } },
              { chambre: { numero: { contains: search } } },
            ],
          }
        : {}),
    },
    include: {
      client: true,
      chambre: true,
      paiements: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reservations);
}

// POST /api/reservations — créer une réservation (public + admin)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    dateArrivee, dateDepart, nbPersonnes,
    chambreId, prenom, nom, email, telephone,
    nationalite, methodePaiement, notes,
  } = body;

  if (!dateArrivee || !dateDepart || !chambreId || !prenom || !nom || !email) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  // Calculer le montant total
  const chambre = await db.chambre.findUnique({ where: { id: chambreId } });
  if (!chambre) return NextResponse.json({ error: "Chambre introuvable" }, { status: 404 });

  const nuits = Math.ceil(
    (new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) / 86400000
  );
  if (nuits <= 0) return NextResponse.json({ error: "Dates invalides" }, { status: 400 });

  const montantTotal = chambre.prix * nuits;

  // Trouver ou créer le client
  let client = await db.client.findUnique({ where: { email } });
  if (!client) {
    client = await db.client.create({
      data: { nom, prenom, email, telephone, nationalite },
    });
  }

  // Déterminer la source
  const session = await auth();
  const source = session ? "SUR_PLACE" : "EN_LIGNE";

  // Créer la réservation
  const reservation = await db.reservation.create({
    data: {
      chambreId,
      clientId: client.id,
      dateArrivee: new Date(dateArrivee),
      dateDepart: new Date(dateDepart),
      nbPersonnes: nbPersonnes ?? 1,
      statut: methodePaiement === "CASH" ? "CONFIRMEE" : "EN_ATTENTE",
      source,
      montantTotal,
      montantPaye: 0,
      notes,
    },
    include: { chambre: true, client: true },
  });

  // Si cash sur place → créer paiement
  if (methodePaiement === "CASH" && session) {
    await db.paiement.create({
      data: {
        reservationId: reservation.id,
        montant: montantTotal,
        methode: "CASH",
      },
    });
    await db.reservation.update({
      where: { id: reservation.id },
      data: { montantPaye: montantTotal },
    });
  }

  return NextResponse.json(reservation, { status: 201 });
}
