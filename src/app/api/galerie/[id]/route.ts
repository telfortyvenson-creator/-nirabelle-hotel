import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const photo = await db.galeriePhoto.update({
    where: { id },
    data: {
      ...(body.url !== undefined && { url: body.url }),
      ...(body.alt !== undefined && { alt: body.alt }),
      ...(body.categorie !== undefined && { categorie: body.categorie }),
      ...(body.ordre !== undefined && { ordre: body.ordre }),
    },
  });
  return NextResponse.json(photo);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await db.galeriePhoto.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
