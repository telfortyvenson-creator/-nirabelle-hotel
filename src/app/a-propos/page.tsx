import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { MapPin, Phone, Mail, Star, Award, Heart } from "lucide-react";

export default function AProposPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="relative pt-28 pb-20 bg-[#1e3a5f] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80')" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-2">Notre histoire</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">À Propos de Nirabelle</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Nirabelle Hôtel & Pool est le complexe hôtelier de référence de Trou du Nord,
            offrant une expérience unique alliant confort moderne et chaleur haïtienne.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-3">Notre complexe</p>
            <h2 className="text-3xl font-bold text-[#0f2340] mb-6">Un havre de paix au cœur du Nord-Est</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Situé au 76, Rue Tica sur la Route Nationale #6, Nirabelle Hôtel & Pool est un complexe hôtelier
              moderne qui propose des chambres confortables, une piscine extérieure, un restaurant et un bar.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Avec plus de 6 000 clients satisfaits et une note de 7.0/10, nous sommes fiers d&apos;offrir
              un service de qualité à tous nos visiteurs — qu&apos;ils soient en voyage d&apos;affaires ou en vacances.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre équipe dédiée est disponible 24h/24 pour répondre à tous vos besoins et vous garantir
              un séjour mémorable à Trou du Nord.
            </p>
          </div>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80"
              alt="Nirabelle Hôtel"
              className="rounded-2xl shadow-xl w-full h-80 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#1e3a5f] text-white p-6 rounded-xl shadow-lg">
              <div className="text-[#c9a84c] font-bold text-3xl">6 672+</div>
              <div className="text-white/70 text-sm">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2340]">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Excellence", desc: "Nous nous engageons à offrir un service de haute qualité à chaque client, à chaque séjour." },
              { icon: Heart, title: "Hospitalité", desc: "La chaleur haïtienne est au cœur de tout ce que nous faisons. Vous êtes chez vous ici." },
              { icon: Award, title: "Confort", desc: "Des chambres modernes, une piscine et des équipements de qualité pour votre bien-être." },
            ].map((v) => (
              <div key={v.title} className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon size={28} className="text-[#1e3a5f]" />
                </div>
                <h3 className="font-bold text-[#0f2340] text-xl mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-[#0f2340] mb-10 text-center">Informations Pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-[#0f2340] mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#c9a84c]" /> Localisation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                76, Rue Tica, Route Nationale #6<br />
                Garcin, Trou du Nord<br />
                Nord-Est, Haïti
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-[#0f2340] mb-4 flex items-center gap-2">
                <Phone size={18} className="text-[#c9a84c]" /> Contact
              </h3>
              <p className="text-gray-600 text-sm">
                <a href="tel:+50942848445" className="hover:text-[#c9a84c]">+509 4284-8445</a><br />
                <a href="mailto:info@nirabelle.ht" className="hover:text-[#c9a84c]">info@nirabelle.ht</a>
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-[#0f2340] mb-4">Horaires Check-in / Check-out</h3>
              <p className="text-gray-600 text-sm">
                Check-in : à partir de <strong>14h00</strong><br />
                Check-out : avant <strong>11h30</strong><br />
                Réception : <strong>24h/24, 7j/7</strong>
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-[#0f2340] mb-4">Politique de l&apos;hôtel</h3>
              <p className="text-gray-600 text-sm">
                • Animaux de compagnie non admis<br />
                • Paiement : Cash ou carte<br />
                • Annulation : 24h avant l&apos;arrivée<br />
                • Parking gratuit disponible
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
