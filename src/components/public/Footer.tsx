import Link from "next/link";
import { Phone, MapPin, Clock, Mail } from "lucide-react";
import { db } from "@/lib/db";

export default async function Footer() {
  const params = await db.parametre.findMany({
    where: {
      cle: {
        in: [
          "branding.logo_line1",
          "branding.logo_line2",
          "hotel.telephone",
          "hotel.adresse",
          "hotel.email",
          "hotel.checkin",
          "hotel.checkout",
          "hotel.description",
        ],
      },
    },
  });
  const p: Record<string, string> = {};
  for (const param of params) p[param.cle] = param.valeur;

  const logoLine1  = p["branding.logo_line1"]  || "NIRABELLE";
  const logoLine2  = p["branding.logo_line2"]  || "HÔTEL & POOL";
  const telephone  = p["hotel.telephone"]       || "+509 4284-8445";
  const adresse    = p["hotel.adresse"]         || "76 Rue Tica, Route Nationale #6, Garcin, Trou du Nord";
  const email      = p["hotel.email"]           || "info@nirabelle.ht";
  const checkin    = p["hotel.checkin"]         || "14:00";
  const checkout   = p["hotel.checkout"]        || "11:30";
  const description = p["hotel.description"]   || "Votre complexe hôtelier de référence à Trou du Nord, Haïti. Confort, élégance et hospitalité.";

  return (
    <footer className="bg-[#0f2340] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Branding */}
        <div>
          <div className="mb-4">
            <div className="text-white font-bold text-xl tracking-wide">{logoLine1}</div>
            <div className="text-[#c9a84c] text-xs tracking-widest">{logoLine2}</div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-[#c9a84c] mb-4 text-sm uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { href: "/chambres", label: "Nos Chambres" },
              { href: "/galerie", label: "Galerie" },
              { href: "/a-propos", label: "À propos" },
              { href: "/contact", label: "Contact" },
              { href: "/reservation", label: "Réservation" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#c9a84c] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-[#c9a84c] mb-4 text-sm uppercase tracking-wider">Contact</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#c9a84c]" />
              {adresse}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-[#c9a84c]" />
              <a href={`tel:${telephone.replace(/\s/g, "")}`} className="hover:text-[#c9a84c] transition-colors">
                {telephone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-[#c9a84c]" />
              <a href={`mailto:${email}`} className="hover:text-[#c9a84c] transition-colors">
                {email}
              </a>
            </li>
          </ul>
        </div>

        {/* Horaires */}
        <div>
          <h3 className="font-semibold text-[#c9a84c] mb-4 text-sm uppercase tracking-wider">Horaires</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-[#c9a84c]" />
              Check-in : à partir de {checkin}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-[#c9a84c]" />
              Check-out : avant {checkout}
            </li>
            <li className="mt-3 text-white/50 text-xs">Réception ouverte 24h/24</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} {logoLine1} {logoLine2} — Tous droits réservés
      </div>
    </footer>
  );
}
