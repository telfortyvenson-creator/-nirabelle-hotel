import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/chambres — liste toutes les chambres
export async function GET() {
  const chambres = await db.chambre.findMany({
    orderBy: [{ etage: "asc" }, { numero: "asc" }],
  });
  return NextResponse.json(chambres);
}

// POST /api/chambres — créer une chambre (admin seulement)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const chambre = await db.chambre.create({ data: body });
  return NextResponse.json(chambre, { status: 201 });
}
