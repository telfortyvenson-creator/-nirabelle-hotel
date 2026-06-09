"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/chambres", label: "Chambres" },
  { href: "/galerie", label: "Galerie" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  logoLine1?: string;
  logoLine2?: string;
  logoUrl?: string;
  telephone?: string;
  adresse?: string;
}

export default function NavbarClient({
  logoLine1 = "NIRABELLE",
  logoLine2 = "HÔTEL & POOL",
  logoUrl,
  telephone = "+509 4284-8445",
  adresse = "76 Rue Tica, Trou du Nord",
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e3a5f]/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="hidden sm:flex items-center justify-end gap-4 py-1 border-b border-white/10 text-xs text-white/70">
          <a href={`tel:${telephone.replace(/\s/g, "")}`} className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors">
            <Phone size={12} />
            {telephone}
          </a>
          <span>|</span>
          <span>{adresse}</span>
        </div>

        {/* Main nav */}
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 leading-none">
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoUrl} alt={logoLine1} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-wide">{logoLine1}</span>
                <span className="text-[#c9a84c] text-xs tracking-widest font-light">{logoLine2}</span>
              </div>
            )}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/80 hover:text-[#c9a84c] text-sm font-medium tracking-wide transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/reservation"
              className="bg-[#c9a84c] hover:bg-[#e6c97a] text-[#0f172a] text-sm font-bold px-5 py-2 rounded transition-colors"
            >
              Réserver
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1e3a5f] border-t border-white/10 px-4 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/80 hover:text-[#c9a84c] border-b border-white/10 text-sm"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/reservation"
            onClick={() => setOpen(false)}
            className="mt-4 block text-center bg-[#c9a84c] text-[#0f172a] font-bold py-3 rounded text-sm"
          >
            Réserver maintenant
          </Link>
        </div>
      )}
    </header>
  );
}
