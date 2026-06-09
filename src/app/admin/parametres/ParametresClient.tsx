"use client";

import { useState, useRef } from "react";

interface GaleriePhoto {
  id: string;
  url: string;
  alt: string;
  categorie: string;
  ordre: number;
}

interface Chambre {
  id: string;
  numero: string;
  nom: string;
  type: string;
  prix: number;
  images: string[];
  description: string;
  equipements: string[];
  capacite: number;
  superficie: number | null;
}

interface Props {
  parametres: Record<string, string>;
  galerie: GaleriePhoto[];
  chambres: Chambre[];
}

const TABS = [
  { id: "hotel", label: "🏨 Hôtel" },
  { id: "branding", label: "🎨 Logo & Texte" },
  { id: "apparence", label: "🖼️ Apparence" },
  { id: "galerie", label: "📷 Galerie" },
  { id: "chambres", label: "🛏️ Chambres" },
  { id: "services", label: "✨ Services" },
];

const CATEGORIES = ["Hôtel", "Piscine", "Chambres", "Restaurant", "Événements", "Extérieur"];

export default function ParametresClient({ parametres: initParams, galerie: initGalerie, chambres: initChambres }: Props) {
  const [activeTab, setActiveTab] = useState("hotel");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // ── Hôtel info ──────────────────────────────────────────
  const [hotelNom, setHotelNom] = useState(initParams["hotel.nom"] || "Nirabelle Hôtel & Pool");
  const [hotelDesc, setHotelDesc] = useState(initParams["hotel.description"] || "");
  const [hotelAdresse, setHotelAdresse] = useState(initParams["hotel.adresse"] || "Trou du Nord, Haïti");
  const [hotelTel, setHotelTel] = useState(initParams["hotel.telephone"] || "");
  const [hotelEmail, setHotelEmail] = useState(initParams["hotel.email"] || "");
  const [hotelCheckin, setHotelCheckin] = useState(initParams["hotel.checkin"] || "14:00");
  const [hotelCheckout, setHotelCheckout] = useState(initParams["hotel.checkout"] || "12:00");

  // ── Branding ────────────────────────────────────────────
  const [logoLine1, setLogoLine1] = useState(initParams["branding.logo_line1"] || "NIRABELLE");
  const [logoLine2, setLogoLine2] = useState(initParams["branding.logo_line2"] || "HÔTEL & POOL");
  const [logoUrl, setLogoUrl] = useState(initParams["branding.logo_url"] || "");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ── Apparence ───────────────────────────────────────────
  const [heroUrl, setHeroUrl] = useState(initParams["hero.image"] || "");
  const [heroUploading, setHeroUploading] = useState(false);

  // ── Galerie ─────────────────────────────────────────────
  const [galerie, setGalerie] = useState<GaleriePhoto[]>(initGalerie);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoAlt, setNewPhotoAlt] = useState("");
  const [newPhotoCat, setNewPhotoCat] = useState("Hôtel");
  const [galUploading, setGalUploading] = useState(false);

  // ── Chambres ─────────────────────────────────────────────
  const [chambres, setChambres] = useState<Chambre[]>(initChambres);
  const [selectedChambre, setSelectedChambre] = useState<string>(initChambres[0]?.id || "");

  // ── Services ─────────────────────────────────────────────
  const [services, setServices] = useState<string[]>(
    initParams["services"] ? JSON.parse(initParams["services"]) : [
      "Piscine", "Wi-Fi gratuit", "Climatisation", "Restaurant", "Bar", "Parking", "Réception 24h/24"
    ]
  );
  const [newService, setNewService] = useState("");

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (text: string) => { setMsg(text); setTimeout(() => setMsg(""), 3500); };

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload échoué");
    const data = await res.json();
    return data.url;
  }

  // ── Save handlers ────────────────────────────────────────

  async function saveBranding() {
    setSaving(true);
    await fetch("/api/parametres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parametres: {
          "branding.logo_line1": logoLine1,
          "branding.logo_line2": logoLine2,
          "branding.logo_url": logoUrl,
        },
      }),
    });
    setSaving(false);
    showMsg("✅ Logo & texte sauvegardés — rechargez le site pour voir les changements");
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadFile(file);
      setLogoUrl(url);
    } catch { showMsg("❌ Erreur upload logo"); }
    setLogoUploading(false);
  }

  async function saveHotel() {
    setSaving(true);
    await fetch("/api/parametres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parametres: {
          "hotel.nom": hotelNom,
          "hotel.description": hotelDesc,
          "hotel.adresse": hotelAdresse,
          "hotel.telephone": hotelTel,
          "hotel.email": hotelEmail,
          "hotel.checkin": hotelCheckin,
          "hotel.checkout": hotelCheckout,
        },
      }),
    });
    setSaving(false);
    showMsg("✅ Informations hôtel sauvegardées");
  }

  async function saveHero() {
    setSaving(true);
    await fetch("/api/parametres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cle: "hero.image", valeur: heroUrl }),
    });
    setSaving(false);
    showMsg("✅ Image hero sauvegardée");
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    try {
      const url = await uploadFile(file);
      setHeroUrl(url);
    } catch { showMsg("❌ Erreur upload"); }
    setHeroUploading(false);
  }

  async function addGaleriePhoto() {
    if (!newPhotoUrl) return;
    const res = await fetch("/api/galerie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newPhotoUrl, alt: newPhotoAlt, categorie: newPhotoCat, ordre: galerie.length }),
    });
    const photo = await res.json();
    setGalerie([...galerie, photo]);
    setNewPhotoUrl(""); setNewPhotoAlt("");
    showMsg("✅ Photo ajoutée");
  }

  async function handleGalUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalUploading(true);
    try {
      const url = await uploadFile(file);
      setNewPhotoUrl(url);
    } catch { showMsg("❌ Erreur upload"); }
    setGalUploading(false);
  }

  async function deletePhoto(id: string) {
    await fetch(`/api/galerie/${id}`, { method: "DELETE" });
    setGalerie(galerie.filter(p => p.id !== id));
    showMsg("🗑️ Photo supprimée");
  }

  async function updatePhotoOrdre(id: string, newOrdre: number) {
    await fetch(`/api/galerie/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ordre: newOrdre }),
    });
    setGalerie(galerie.map(p => p.id === id ? { ...p, ordre: newOrdre } : p)
      .sort((a, b) => a.ordre - b.ordre));
  }

  const currentChambre = chambres.find(c => c.id === selectedChambre);

  async function saveChambre(chambre: Chambre) {
    setSaving(true);
    await fetch(`/api/chambres/${chambre.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prix: chambre.prix,
        description: chambre.description,
        images: chambre.images,
        equipements: chambre.equipements,
        capacite: chambre.capacite,
        superficie: chambre.superficie,
      }),
    });
    setSaving(false);
    showMsg("✅ Chambre sauvegardée");
  }

  function updateCurrentChambre(patch: Partial<Chambre>) {
    setChambres(chambres.map(c => c.id === selectedChambre ? { ...c, ...patch } : c));
  }

  async function handleChambreImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentChambre) return;
    try {
      const url = await uploadFile(file);
      updateCurrentChambre({ images: [...currentChambre.images, url] });
      showMsg("✅ Image uploadée");
    } catch { showMsg("❌ Erreur upload"); }
  }

  async function saveServices() {
    setSaving(true);
    await fetch("/api/parametres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cle: "services", valeur: JSON.stringify(services) }),
    });
    setSaving(false);
    showMsg("✅ Services sauvegardés");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">⚙️ Paramètres</h1>

      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? "bg-[#1e3a5f] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Hôtel ── */}
      {activeTab === "hotel" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Informations de l&apos;hôtel</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;hôtel</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelNom} onChange={e => setHotelNom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelAdresse} onChange={e => setHotelAdresse(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelTel} onChange={e => setHotelTel(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelEmail} onChange={e => setHotelEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure check-in</label>
              <input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelCheckin} onChange={e => setHotelCheckin(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure check-out</label>
              <input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelCheckout} onChange={e => setHotelCheckout(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (page À propos)</label>
            <textarea rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" value={hotelDesc} onChange={e => setHotelDesc(e.target.value)} />
          </div>
          <button onClick={saveHotel} disabled={saving} className="btn-primary">
            {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>
      )}

      {/* ── TAB: Branding ── */}
      {activeTab === "branding" && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Logo & Texte du site</h2>

          {/* Aperçu */}
          <div className="border rounded-xl p-4 bg-[#1e3a5f] flex items-center gap-4">
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-lg tracking-wide">{logoLine1 || "NIRABELLE"}</span>
                <span className="text-[#c9a84c] text-xs tracking-widest font-light">{logoLine2 || "HÔTEL & POOL"}</span>
              </div>
            )}
            <span className="text-white/40 text-xs ml-2">← Aperçu en direct</span>
          </div>

          {/* Logo image (optionnel) */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-medium text-gray-700">Logo image (optionnel)</h3>
            <p className="text-xs text-gray-500">Si vous uploadez un logo image, il remplace le texte. Laissez vide pour garder le texte.</p>
            {logoUrl && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Logo actuel" className="h-12 w-auto object-contain border rounded p-1" />
                <button onClick={() => setLogoUrl("")} className="text-red-500 text-sm hover:underline">
                  Supprimer le logo image
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                placeholder="https://... (URL du logo)"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
              />
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="px-4 py-2 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm hover:bg-[#1e3a5f]/5"
              >
                {logoUploading ? "Upload..." : "📁 Upload"}
              </button>
            </div>
          </div>

          {/* Texte logo */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-medium text-gray-700">Texte du logo (si pas d&apos;image)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ligne 1 (grande, blanche)</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm font-bold"
                  value={logoLine1}
                  onChange={e => setLogoLine1(e.target.value)}
                  placeholder="NIRABELLE"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ligne 2 (petite, dorée)</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={logoLine2}
                  onChange={e => setLogoLine2(e.target.value)}
                  placeholder="HÔTEL & POOL"
                />
              </div>
            </div>
          </div>

          <button onClick={saveBranding} disabled={saving} className="btn-primary">
            {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>
      )}

      {/* ── TAB: Apparence ── */}
      {activeTab === "apparence" && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Image de fond — Page d&apos;accueil</h2>

          {heroUrl && (
            <div className="relative rounded-xl overflow-hidden h-48 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Aperçu de l&apos;image hero</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l&apos;image</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="https://..."
                value={heroUrl}
                onChange={e => setHeroUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">ou</span>
              <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
              <button
                onClick={() => heroInputRef.current?.click()}
                disabled={heroUploading}
                className="px-4 py-2 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm hover:bg-[#1e3a5f]/5 transition"
              >
                {heroUploading ? "Upload..." : "📁 Uploader une image"}
              </button>
            </div>
          </div>

          <button onClick={saveHero} disabled={saving} className="btn-primary">
            {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>
      )}

      {/* ── TAB: Galerie ── */}
      {activeTab === "galerie" && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Gestion de la galerie</h2>

          {/* Add new photo */}
          <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
            <h3 className="font-medium text-gray-700">Ajouter une photo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL de la photo</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="https://..."
                  value={newPhotoUrl}
                  onChange={e => setNewPhotoUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description (alt)</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Description de la photo"
                  value={newPhotoAlt}
                  onChange={e => setNewPhotoAlt(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Catégorie</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" value={newPhotoCat} onChange={e => setNewPhotoCat(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <input ref={galInputRef} type="file" accept="image/*" className="hidden" onChange={handleGalUpload} />
                <button
                  onClick={() => galInputRef.current?.click()}
                  disabled={galUploading}
                  className="flex-1 px-3 py-2 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm hover:bg-[#1e3a5f]/5"
                >
                  {galUploading ? "Upload..." : "📁 Upload"}
                </button>
                <button onClick={addGaleriePhoto} disabled={!newPhotoUrl} className="flex-1 btn-primary text-sm py-2">
                  ➕ Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Photos grid */}
          <div className="grid grid-cols-3 gap-4">
            {galerie.map((photo, idx) => (
              <div key={photo.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="h-32 bg-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" />
                  <span className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {photo.categorie}
                  </span>
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs text-gray-600 truncate">{photo.alt || "(sans description)"}</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => idx > 0 && updatePhotoOrdre(photo.id, photo.ordre - 1)}
                      disabled={idx === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-1"
                    >⬆</button>
                    <button
                      onClick={() => idx < galerie.length - 1 && updatePhotoOrdre(photo.id, photo.ordre + 1)}
                      disabled={idx === galerie.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-1"
                    >⬇</button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="ml-auto text-red-500 hover:text-red-700 text-xs px-1"
                    >🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {galerie.length === 0 && (
            <p className="text-center text-gray-400 py-8">Aucune photo dans la galerie</p>
          )}
        </div>
      )}

      {/* ── TAB: Chambres ── */}
      {activeTab === "chambres" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Configuration des chambres</h2>

          {/* Chambre selector */}
          <div className="flex gap-2 flex-wrap">
            {chambres.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedChambre(c.id)}
                className={`px-3 py-1.5 text-sm rounded-full border transition ${
                  selectedChambre === c.id
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : "border-gray-300 text-gray-600 hover:border-[#1e3a5f]"
                }`}
              >
                #{c.numero} — {c.nom}
              </button>
            ))}
          </div>

          {currentChambre && (
            <div className="border rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix / nuit (USD)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={currentChambre.prix}
                    onChange={e => updateCurrentChambre({ prix: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (personnes)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={currentChambre.capacite}
                    onChange={e => updateCurrentChambre({ capacite: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={currentChambre.superficie || ""}
                    onChange={e => updateCurrentChambre({ superficie: parseFloat(e.target.value) || null })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={currentChambre.description}
                  onChange={e => updateCurrentChambre({ description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipements (un par ligne)</label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={currentChambre.equipements.join("\n")}
                  onChange={e => updateCurrentChambre({ equipements: e.target.value.split("\n").filter(s => s.trim()) })}
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images de la chambre</label>
                <div className="flex gap-3 flex-wrap mb-3">
                  {currentChambre.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-20 rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => updateCurrentChambre({ images: currentChambre.images.filter((_, i) => i !== idx) })}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-700"
                      >×</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    placeholder="https://... (URL image)"
                    id="chambre-img-url"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById("chambre-img-url") as HTMLInputElement;
                      if (input?.value) {
                        updateCurrentChambre({ images: [...currentChambre.images, input.value] });
                        input.value = "";
                      }
                    }}
                    className="px-4 py-2 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm hover:bg-[#1e3a5f]/5"
                  >
                    ➕ URL
                  </button>
                  <label className="px-4 py-2 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm hover:bg-[#1e3a5f]/5 cursor-pointer">
                    📁 Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleChambreImageUpload} />
                  </label>
                </div>
              </div>

              <button onClick={() => saveChambre(currentChambre)} disabled={saving} className="btn-primary">
                {saving ? "Sauvegarde..." : "💾 Sauvegarder la chambre"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Services ── */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Services & Équipements affichés sur le site</h2>
          <p className="text-sm text-gray-500">Ces services apparaissent sur la page d&apos;accueil et la page À propos.</p>

          <ul className="space-y-2">
            {services.map((s, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <input
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  value={s}
                  onChange={e => setServices(services.map((sv, i) => i === idx ? e.target.value : sv))}
                />
                <button
                  onClick={() => setServices(services.filter((_, i) => i !== idx))}
                  className="text-red-500 hover:text-red-700 text-lg px-2"
                >×</button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Nouveau service..."
              value={newService}
              onChange={e => setNewService(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newService.trim()) {
                  setServices([...services, newService.trim()]);
                  setNewService("");
                }
              }}
            />
            <button
              onClick={() => {
                if (newService.trim()) { setServices([...services, newService.trim()]); setNewService(""); }
              }}
              className="px-4 py-2 btn-primary"
            >
              ➕ Ajouter
            </button>
          </div>

          <button onClick={saveServices} disabled={saving} className="btn-primary">
            {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>
      )}
    </div>
  );
}
