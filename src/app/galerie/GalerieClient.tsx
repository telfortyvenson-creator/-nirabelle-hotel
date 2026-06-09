"use client";

import { useState } from "react";

interface Photo {
  id: string;
  src: string;
  cat: string;
  alt: string;
}

interface Props {
  photos: Photo[];
  categories: string[];
}

export default function GalerieClient({ photos, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = activeCategory === "Tous"
    ? photos
    : photos.filter(p => p.cat === activeCategory);

  return (
    <>
      {/* Filter tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "border-gray-200 hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((p) => (
              <div key={p.id} className="break-inside-avoid group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#0f2340]/0 group-hover:bg-[#0f2340]/40 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <div>
                    <span className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">{p.cat}</span>
                    <p className="text-white text-sm font-medium">{p.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-16">Aucune photo dans cette catégorie</p>
          )}
        </div>
      </section>
    </>
  );
}
