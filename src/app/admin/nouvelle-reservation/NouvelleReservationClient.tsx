"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Users, Calendar, Loader2 } from "lucide-react";

type Chambre = {
  id: string; numero: string; nom: string; type: string;
  prix: number; capacite: number; statut: string;
};

const statutColor: Record<string, string> = {
  DISPONIBLE:  "bg-green-100 border-green-300 text-green-700",
  OCCUPEE:     "bg-red-100 border-red-200 text-red-600",
  MAINTENANCE: "bg-gray-100 border-gray-200 text-gray-500",
};

export default function NouvelleReservationClient() {
  const router = useRouter();
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loadingChambres, setLoadingChambres] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    dateArrivee: "", dateDepart: "", nbPersonnes: 1,
    chambreId: "", prenom: "", nom: "",
    email: "", telephone: "", pieceId: "",
    methode: "CASH", notes: "",
  });

  const update = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const chambre = chambres.find((c) => c.id === form.chambreId);
  const nuits = form.dateArrivee && form.dateDepart
    ? Math.max(0, Math.ceil((new Date(form.dateDepart).getTime() - new Date(form.dateArrivee).getTime()) / 86400000))
    : 0;
  const total = chambre ? chambre.prix * nuits : 0;

  const fetchChambres = useCallback(async () => {
    if (!form.dateArrivee || !form.dateDepart || nuits <= 0) return;
    setLoadingChambres(true);
    setForm((f) => ({ ...f, chambreId: "" }));
    try {
      const res = await fetch(
        `/api/chambres/disponibles?dateArrivee=${form.dateArrivee}&dateDepart=${form.dateDepart}&nbPersonnes=${form.nbPersonnes}`
      );
      const data = await res.json();
      setChambres(data);
    } finally {
      setLoadingChambres(false);
    }
  }, [form.dateArrivee, form.dateDepart, form.nbPersonnes, nuits]);

  useEffect(() => {
    fetchChambres();
  }, [fetchChambres]);

  const handleSubmit = async () => {
    if (!form.chambreId || !form.prenom || !form.nom || nuits <= 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nationalite: "",
          methodePaiement: form.methode,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/admin/reservations"), 1800);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-[#0f2340] mb-2">Réservation créée !</h2>
        <p className="text-gray-400 text-sm">Redirection vers les réservations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2340]">Nouvelle Réservation</h1>
        <p className="text-gray-400 text-sm">Réservation sur place — Réception</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Dates */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-[#0f2340] mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[#c9a84c]" /> Dates du séjour
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;arrivée</label>
                <input type="date" value={form.dateArrivee}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("dateArrivee", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                <input type="date" value={form.dateDepart}
                  min={form.dateArrivee || new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("dateDepart", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Users size={14} /> Personnes
              </label>
              <select value={form.nbPersonnes} onChange={(e) => update("nbPersonnes", parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]">
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>

          {/* Chambres disponibles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-[#0f2340] mb-2">Chambres Disponibles</h2>
            {!form.dateArrivee || !form.dateDepart || nuits <= 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">Sélectionnez les dates pour voir les chambres disponibles</p>
            ) : loadingChambres ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Loader2 size={20} className="animate-spin mr-2" /> Vérification des disponibilités...
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  {chambres.length} chambre{chambres.length !== 1 ? "s" : ""} disponible{chambres.length !== 1 ? "s" : ""} pour {nuits} nuit{nuits > 1 ? "s" : ""}
                </p>
                {chambres.length === 0 ? (
                  <p className="text-center py-6 text-orange-500 font-medium text-sm">
                    Aucune chambre disponible pour ces dates. Essayez d&apos;autres dates.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {chambres.map((c) => (
                      <button key={c.id}
                        onClick={() => update("chambreId", c.id)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          form.chambreId === c.id
                            ? "border-[#1e3a5f] bg-[#1e3a5f]/5"
                            : "border-green-300 bg-green-50 hover:border-[#1e3a5f]/50"
                        }`}>
                        {form.chambreId === c.id && (
                          <CheckCircle size={14} className="absolute top-2 right-2 text-[#1e3a5f]" />
                        )}
                        <div className="font-bold text-lg text-[#0f2340]">#{c.numero}</div>
                        <div className="text-xs font-medium text-gray-600">{c.type}</div>
                        <div className="text-[#c9a84c] font-bold text-sm mt-1">${c.prix}/nuit</div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Informations client */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-[#0f2340] mb-4">Informations Client</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input type="text" value={form.prenom} onChange={(e) => update("prenom", e.target.value)} placeholder="Jean"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={form.nom} onChange={(e) => update("nom", e.target.value)} placeholder="Dupont"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} placeholder="+509 ..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° Pièce d&apos;identité</label>
                  <input type="text" value={form.pieceId} onChange={(e) => update("pieceId", e.target.value)} placeholder="CIN, Passeport..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jean@exemple.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                <select value={form.methode} onChange={(e) => update("methode", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]">
                  <option value="CASH">Cash</option>
                  <option value="MONCASH">MonCash</option>
                  <option value="VIREMENT">Virement</option>
                  <option value="STRIPE">Carte bancaire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2}
                  placeholder="Demandes particulières..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.chambreId || !form.dateArrivee || !form.dateDepart || !form.prenom || !form.nom || submitting}
            className="w-full bg-[#1e3a5f] hover:bg-[#0f2340] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</> : `Confirmer la réservation${total > 0 ? ` — $${total}` : ""}`}
          </button>
        </div>

        {/* Résumé */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-[#0f2340] mb-4">Résumé</h3>
            {chambre ? (
              <div className="space-y-3 text-sm">
                <div className="bg-[#1e3a5f]/5 rounded-xl p-4">
                  <div className="font-bold text-[#0f2340]">Chambre #{chambre.numero}</div>
                  <div className="text-gray-500">{chambre.nom}</div>
                </div>
                {nuits > 0 && (
                  <>
                    <div className="flex justify-between text-gray-500"><span>Arrivée</span><span className="font-medium">{form.dateArrivee}</span></div>
                    <div className="flex justify-between text-gray-500"><span>Départ</span><span className="font-medium">{form.dateDepart}</span></div>
                    <div className="flex justify-between text-gray-500"><span>Durée</span><span className="font-medium">{nuits} nuit{nuits > 1 ? "s" : ""}</span></div>
                    <div className="flex justify-between text-gray-500"><span>${chambre.prix} × {nuits}</span><span>${total}</span></div>
                    <div className="flex justify-between font-bold text-[#0f2340] border-t pt-3 text-base">
                      <span>Total</span>
                      <span className="text-[#c9a84c] text-xl">${total}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">Sélectionnez une chambre et des dates</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
