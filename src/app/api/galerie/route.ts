import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const photos = await db.galeriePhoto.findMany({ orderBy: [{ ordre: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { url, alt, categorie, ordre } = body;

  const photo = await db.galeriePhoto.create({
    data: { url, alt: alt || "", categorie: categorie || "Hôtel", ordre: ordre ?? 0 },
  });
  return NextResponse.json(photo, { status: 201 });
}
