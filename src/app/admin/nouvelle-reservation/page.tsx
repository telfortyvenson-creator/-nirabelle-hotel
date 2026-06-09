import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NouvelleReservationClient from "./NouvelleReservationClient";

export default async function NouvelleReservationPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return <NouvelleReservationClient />;
}
