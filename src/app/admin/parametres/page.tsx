import { db } from "@/lib/db";
import ParametresClient from "./ParametresClient";

export default async function ParametresPage() {
  const [parametresArr, galerie, chambres] = await Promise.all([
    db.parametre.findMany(),
    db.galeriePhoto.findMany({ orderBy: [{ ordre: "asc" }, { createdAt: "asc" }] }),
    db.chambre.findMany({ orderBy: { numero: "asc" } }),
  ]);

  const parametres: Record<string, string> = {};
  for (const p of parametresArr) parametres[p.cle] = p.valeur;

  return (
    <ParametresClient
      parametres={parametres}
      galerie={galerie}
      chambres={chambres}
    />
  );
}
