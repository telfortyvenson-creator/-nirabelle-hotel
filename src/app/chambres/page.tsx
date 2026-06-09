import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Users, Maximize2, CheckCircle } from "lucide-react";

const chambres = [
  {
    id: "1",
    numero: "101",
    nom: "Chambre Standard",
    type: "STANDARD",
    prix: 29,
    capacite: 2,
    superficie: 22,
    description:
      "Notre chambre standard offre tout le confort nécessaire pour un séjour agréable. Équipée d'un lit double, d'une climatisation individuelle, d'une salle de bain privée avec douche, d'un minibar et d'une TV satellite.",
    equipements: ["Lit double", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Salle de bain privée", "Coffre-fort"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: "2",
    numero: "201",
    nom: "Chambre Deluxe",
    type: "DELUXE",
    prix: 55,
    capacite: 2,
    superficie: 32,
    description:
      "La chambre Deluxe offre un espace plus grand avec une décoration soignée et une vue sur la piscine. Idéale pour les couples, elle dispose d'un lit King Size, d'un coin salon et d'une salle de bain avec baignoire.",
    equipements: ["Lit King Size", "Vue piscine", "Coin salon", "Baignoire", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Accès piscine"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    id: "3",
    numero: "301",
    nom: "Suite Junior",
    type: "SUITE",
    prix: 90,
    capacite: 3,
    superficie: 48,
    description:
      "La Suite Junior est notre option premium avec un salon séparé, un dressing et une salle de bain luxueuse avec bain à remous. Service de chambre prioritaire et panier de bienvenue inclus.",
    equipements: ["Salon séparé", "Bain à remous", "Dressing", "Room service", "Panier de bienvenue", "Lit King Size", "Climatisation", "TV 55\"", "WiFi gratuit", "Minibar premium"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  },
  {
    id: "4",
    numero: "401",
    nom: "Suite Présidentielle",
    type: "SUITE_PRESIDENTIELLE",
    prix: 150,
    capacite: 4,
    superficie: 80,
    description:
      "Notre suite la plus prestigieuse avec 2 chambres, un grand salon, terrasse privée avec vue panoramique, cuisine équipée et service butler dédié. L'expérience ultime du luxe à Trou du Nord.",
    equipements: ["2 chambres", "Terrasse privée", "Vue panoramique", "Cuisine équipée", "Butler dédié", "Jacuzzi", "2 salles de bain", "Salle à manger", "WiFi premium"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
  },
];

const typeBadge: Record<string, string> = {
  STANDARD: "bg-gray-100 text-gray-700",
  DELUXE: "bg-blue-100 text-blue-700",
  SUITE: "bg-purple-100 text-purple-700",
  SUITE_PRESIDENTIELLE: "bg-amber-100 text-amber-700",
};

const typeLabel: Record<string, string> = {
  STANDARD: "Standard",
  DELUXE: "Deluxe",
  SUITE: "Suite Junior",
  SUITE_PRESIDENTIELLE: "Suite Présidentielle",
};

export default function ChambresPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="relative pt-28 pb-16 bg-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-2">Confort & élégance</p>
          <h1 className="text-4xl font-bold mb-4">Nos Chambres & Suites</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Chaque chambre est pensée pour votre confort avec une décoration moderne et des équipements de qualité.
          </p>
        </div>
      </div>

      {/* Chambres list */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          {chambres.map((c, i) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.nom} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${typeBadge[c.type]}`}>
                  {typeLabel[c.type]}
                </div>
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-[#0f2340]">{c.nom}</h2>
                    <div className="text-right">
                      <div className="text-[#c9a84c] font-bold text-3xl">${c.prix}</div>
                      <div className="text-gray-400 text-xs">par nuit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Users size={14} /> {c.capacite} personnes</span>
                    <span className="flex items-center gap-1"><Maximize2 size={14} /> {c.superficie} m²</span>
                    <span className="text-gray-300">|</span>
                    <span>Chambre N° {c.numero}</span>
                  </div>
                  <p className="text-gray-600 mb-5 leading-relaxed text-sm">{c.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.equipements.map((eq) => (
                      <span key={eq} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                        <CheckCircle size={11} className="text-green-500" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/reservation?type=${c.type}`}
                  className="inline-block text-center bg-[#1e3a5f] hover:bg-[#0f2340] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Réserver cette chambre
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
