import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-16 bg-[#1e3a5f] text-center text-white">
        <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-2">Nous joindre</p>
        <h1 className="text-4xl font-bold mb-4">Contactez-Nous</h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Notre équipe est disponible 24h/24 pour répondre à toutes vos questions.
        </p>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12">
          {/* Infos */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0f2340] mb-6">Nos Coordonnées</h2>
            {[
              {
                icon: MapPin,
                title: "Adresse",
                content: "76, Rue Tica, Route Nationale #6\nGarcin, Trou du Nord\nNord-Est, Haïti",
              },
              {
                icon: Phone,
                title: "Téléphone",
                content: "+509 4284-8445",
                link: "tel:+50942848445",
              },
              {
                icon: Mail,
                title: "Email",
                content: "info@nirabelle.ht",
                link: "mailto:info@nirabelle.ht",
              },
              {
                icon: Clock,
                title: "Réception",
                content: "Ouverte 24h/24, 7j/7\nCheck-in : 14h00 | Check-out : 11h30",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-[#1e3a5f]" />
                </div>
                <div>
                  <div className="font-semibold text-[#0f2340] mb-1">{item.title}</div>
                  {item.link ? (
                    <a href={item.link} className="text-gray-600 text-sm hover:text-[#c9a84c] transition-colors">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm whitespace-pre-line">{item.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="bg-[#1e3a5f]/5 border-2 border-dashed border-[#1e3a5f]/20 rounded-xl h-48 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin size={32} className="mx-auto mb-2" />
                <p className="text-sm">76 Rue Tica, Trou du Nord</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0f2340] mb-6">Envoyer un Message</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    placeholder="Jean"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    placeholder="Dupont"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="jean@exemple.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  placeholder="+509 ..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                  <option>Demande de réservation</option>
                  <option>Renseignements sur les chambres</option>
                  <option>Événement / Groupe</option>
                  <option>Réclamation</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Votre message..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1e3a5f] hover:bg-[#0f2340] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
