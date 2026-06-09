import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const params = await db.parametre.findMany();
  const result: Record<string, string> = {};
  for (const p of params) {
    result[p.cle] = p.valeur;
  }
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  // body = { cle: string, valeur: string } or { parametres: Record<string,string> }

  if (body.parametres) {
    const updates = await Promise.all(
      Object.entries(body.parametres as Record<string, string>).map(([cle, valeur]) =>
        db.parametre.upsert({
          where: { cle },
          update: { valeur },
          create: { cle, valeur },
        })
      )
    );
    return NextResponse.json({ updated: updates.length });
  }

  const { cle, valeur } = body;
  const param = await db.parametre.upsert({
    where: { cle },
    update: { valeur },
    create: { cle, valeur },
  });
  return NextResponse.json(param);
}
