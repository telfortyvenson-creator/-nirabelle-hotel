import { db } from "@/lib/db";
import NavbarClient from "./NavbarClient";

// Server component — fetches branding from DB then renders interactive client Navbar
export default async function Navbar() {
  const params = await db.parametre.findMany({
    where: {
      cle: {
        in: [
          "branding.logo_line1",
          "branding.logo_line2",
          "branding.logo_url",
          "hotel.telephone",
          "hotel.adresse",
        ],
      },
    },
  });

  const p: Record<string, string> = {};
  for (const param of params) p[param.cle] = param.valeur;

  return (
    <NavbarClient
      logoLine1={p["branding.logo_line1"]}
      logoLine2={p["branding.logo_line2"]}
      logoUrl={p["branding.logo_url"]}
      telephone={p["hotel.telephone"]}
      adresse={p["hotel.adresse"]}
    />
  );
}
