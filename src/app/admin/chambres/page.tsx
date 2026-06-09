import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChambresClient from "./ChambresClient";

export default async function ChambresPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const chambres = await db.chambre.findMany({
    orderBy: [{ etage: "asc" }, { numero: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2340]">Gestion des Chambres</h1>
          <p className="text-gray-400 text-sm">{chambres.length} chambres au total</p>
        </div>
      </div>
      <ChambresClient chambres={chambres} />
    </div>
  );
}
