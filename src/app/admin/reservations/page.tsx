import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReservationsClient from "./ReservationsClient";

export default async function ReservationsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const reservations = await db.reservation.findMany({
    include: { client: true, chambre: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2340]">Réservations</h1>
          <p className="text-gray-400 text-sm">{reservations.length} réservations au total</p>
        </div>
        <Link
          href="/admin/nouvelle-reservation"
          className="bg-[#1e3a5f] hover:bg-[#0f2340] text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          + Nouvelle
        </Link>
      </div>
      <ReservationsClient reservations={reservations} />
    </div>
  );
}
