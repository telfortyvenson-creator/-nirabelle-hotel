import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import GalerieClient from "./GalerieClient";

const FALLBACK_PHOTOS = [
  { id: "f1", src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", cat: "Hôtel", alt: "Vue générale de l'hôtel" },
  { id: "f2", src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", cat: "Chambres", alt: "Chambre Standard" },
  { id: "f3", src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", cat: "Piscine", alt: "Piscine extérieure" },
  { id: "f4", src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", cat: "Chambres", alt: "Chambre Deluxe" },
  { id: "f5", src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", cat: "Restaurant", alt: "Restaurant" },
  { id: "f6", src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", cat: "Chambres", alt: "Suite Junior" },
  { id: "f7", src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", cat: "Hôtel", alt: "Réception" },
  { id: "f8", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", cat: "Piscine", alt: "Bar piscine" },
  { id: "f9", src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", cat: "Chambres", alt: "Suite Présidentielle" },
  { id: "f10", src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80", cat: "Hôtel", alt: "Terrasse extérieure" },
];

export default async function GaleriePage() {
  const dbPhotos = await db.galeriePhoto.findMany({
    orderBy: [{ ordre: "asc" }, { createdAt: "asc" }],
  });

  const photos = dbPhotos.length > 0
    ? dbPhotos.map(p => ({ id: p.id, src: p.url, cat: p.categorie, alt: p.alt || p.categorie }))
    : FALLBACK_PHOTOS;

  const categories = ["Tous", ...Array.from(new Set(photos.map(p => p.cat)))];

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-16 bg-[#1e3a5f] text-center text-white">
        <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-2">En images</p>
        <h1 className="text-4xl font-bold mb-4">Galerie Nirabelle</h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Découvrez notre complexe hôtelier à travers ces photos et laissez-vous inspirer pour votre prochain séjour.
        </p>
      </div>

      <GalerieClient photos={photos} categories={categories} />

      <Footer />
    </>
  );
}
