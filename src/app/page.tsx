import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Wifi, Car, Utensils, Waves, Wind, Tv, Star } from "lucide-react";
import { db } from "@/lib/db";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Piscine": Waves,
  "Wi-Fi gratuit": Wifi,
  "Wi-Fi Gratuit": Wifi,
  "WiFi Gratuit": Wifi,
  "Climatisation": Wind,
  "Restaurant": Utensils,
  "Restaurant & Bar": Utensils,
  "Bar": Utensils,
  "Parking": Car,
  "TV Satellite": Tv,
};

export default async function HomePage() {
  // Load from DB (parametres + chambres)
  const [parametresArr, chambresDB] = await Promise.all([
    db.parametre.findMany(),
    db.chambre.findMany({ take: 3, orderBy: { prix: "asc" } }),
  ]);
  const parametres: Record<string, string> = {};
  for (const p of parametresArr) parametres[p.cle] = p.valeur;

  const heroImage = parametres["hero.image"] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80";
  const dbServices: string[] = parametres["services"] ? JSON.parse(parametres["services"]) : [
    "Piscine", "Wi-Fi gratuit", "Climatisation", "Restaurant", "Bar", "Parking",
  ];

  const chambresVedettes = chambresDB.map(c => ({
    id: c.id,
    nom: c.nom,
    type: c.type,
    prix: c.prix,
    description: c.description,
    image: c.images[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  }));

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-[#0f2340]/60" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase mb-4 font-light">
            Trou du Nord, Haïti
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Nirabelle Hôtel & Pool
          </h1>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Découvrez le confort et l&apos;élégance au cœur du Nord-Est haïtien.
            Piscine, restaurant, et chambres modernes vous attendent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="bg-[#c9a84c] hover:bg-[#e6c97a] text-[#0f172a] font-bold px-8 py-4 rounded text-base transition-colors"
            >
              Réserver maintenant
            </Link>
            <Link
              href="/chambres"
              className="border-2 border-white/60 hover:border-white text-white font-semibold px-8 py-4 rounded text-base transition-colors"
            >
              Voir nos chambres
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* INFO BAR */}
      <section className="bg-[#1e3a5f] text-white py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div><div className="text-[#c9a84c] font-bold text-2xl">20+</div><div className="text-white/70">Chambres</div></div>
          <div><div className="text-[#c9a84c] font-bold text-2xl">7.0/10</div><div className="text-white/70">Note clients</div></div>
          <div><div className="text-[#c9a84c] font-bold text-2xl">24h/24</div><div className="text-white/70">Réception</div></div>
          <div><div className="text-[#c9a84c] font-bold text-2xl">$29+</div><div className="text-white/70">Par nuit</div></div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-2">Ce que nous offrons</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2340]">Nos Services & Équipements</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {dbServices.map((label) => {
              const Icon = SERVICE_ICONS[label] || Star;
              return (
                <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[#1e3a5f]" />
                  </div>
                  <h3 className="font-bold text-[#0f2340]">{label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHAMBRES VEDETTES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-2">Confort & élégance</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2340]">Nos Chambres</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chambresVedettes.map((c) => (
              <div key={c.id} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-[#1e3a5f] text-white text-xs font-bold px-3 py-1 rounded-full">{c.type}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#0f2340] text-lg">{c.nom}</h3>
                    <div className="text-right">
                      <span className="text-[#c9a84c] font-bold text-xl">${c.prix}</span>
                      <span className="text-gray-400 text-xs block">/nuit</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{c.description}</p>
                  <Link href={`/reservation?type=${c.type}`} className="block text-center bg-[#1e3a5f] hover:bg-[#0f2340] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                    Réserver cette chambre
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/chambres" className="border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block">
              Voir toutes les chambres →
            </Link>
          </div>
        </div>
      </section>

      {/* PISCINE BANNER */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=80')" }} />
        <div className="absolute inset-0 bg-[#0f2340]/65" />
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">Profitez de Notre Piscine</h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Détendez-vous au bord de notre piscine extérieure et savourez un cocktail au bar de la piscine.
          </p>
          <Link href="/reservation" className="bg-[#c9a84c] hover:bg-[#e6c97a] text-[#0f172a] font-bold px-8 py-4 rounded inline-block transition-colors">
            Réserver un séjour
          </Link>
        </div>
      </section>

      {/* CTA CONTACT */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2340] mb-4">Une question ? Contactez-nous</h2>
          <p className="text-gray-500 mb-8">Notre équipe est disponible 24h/24 pour vous aider à planifier votre séjour idéal.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+50942848445" className="bg-[#1e3a5f] hover:bg-[#0f2340] text-white font-bold px-8 py-3 rounded-lg transition-colors inline-block">
              +509 4284-8445
            </a>
            <Link href="/contact" className="border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block">
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
