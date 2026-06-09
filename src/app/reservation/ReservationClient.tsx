"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Users, Calendar, CreditCard, Loader2 } from "lucide-react";

type Chambre = {
  id: string; numero: string; nom: string; type: string;
  prix: number; capacite: number; images: string[];
};

const etapes = ["Dates & Chambre", "Vos Informations", "Paiement", "Confirmation"];

const typeLabel: Record<string, string> = {
  STANDARD: "Standard", DELUXE: "Deluxe",
  SUITE: "Suite", SUITE_PRESIDENTIELLE: "Suite Prés.",
};

export default function ReservationClient() {
  const [etape, setEtape]           = useState(0);
  const [chambres, setChambres]     = useState<Chambre[]>([]);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const [form, setForm] = useState({
    dateArrivee: "", dateDepart: "", nbPersonnes: 1, chambreId: "",
    prenom: "", nom: "", email: "", telephone: "", nationalite: "",
    methodePaiement: "STRIPE", notes: "",
  });

  const update = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const chambreSelectionnee = chambres.find((c) => c.id === form.chambreId);
  const nuits = form.dateArrivee && form.dateDepart
    ? Math.max(0, Math.ceil((new Date(form.dateDepart).getTime() - new Date(form.dateArrivee).getTime()) / 86400000))
    : 0;
  const total = chambreSelectionnee ? chambreSelectionnee.prix * nuits : 0;

  const fetchDisponibles = useCallback(async () => {
    if (!form.dateArrivee || !form.dateDepart || nuits <= 0) return;
    setLoading(true);
    setForm((f) => ({ ...f, chambreId: "" }));
    try {
      const res = await fetch(
        `/api/chambres/disponibles?dateArrivee=${form.dateArrivee}&dateDepart=${form.dateDepart}&nbPersonnes=${form.nbPersonnes}`
      );
      setChambres(await res.json());
    } finally { setLoading(false); }
  }, [form.dateArrivee, form.dateDepart, form.nbPersonnes, nuits]);

  useEffect(() => { fetchDisponibles(); }, [fetchDisponibles]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setReservationId(data.id);
        setEtape(3);
      }
    } finally { setSubmitting(false); }
  };

  const peutContinuer = () => {
    if (etape === 0) return form.dateArrivee && form.dateDepart && form.chambreId && nuits > 0;
    if (etape === 1) return form.prenom && form.nom && form.email;
    return true;
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">

      {/* Barre de progression */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {etapes.map((e, i) => (
              <div key={e} className="flex items-center">
                <div className={`flex items-center gap-2 text-sm font-medium ${i <= etape ? "text-[#1e3a5f]" : "text-gray-400"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${i < etape ? "bg-green-500 text-white" : i === etape ? "bg-[#1e3a5f] text-white" : "bg-gray-200 text-gray-500"}`}>
                    {i < etape ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block">{e}</span>
                </div>
                {i < etapes.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-16 mx-2 ${i < etape ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* ÉTAPE 0 */}
          {etape === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-[#0f2340] mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-[#c9a84c]" /> Choisissez vos dates
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;arrivée</label>
                  <input type="date" min={new Date().toISOString().split("T")[0]} value={form.dateArrivee}
                    onChange={(e) => update("dateArrivee", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                  <input type="date" min={form.dateArrivee || new Date().toISOString().split("T")[0]} value={form.dateDepart}
                    onChange={(e) => update("dateDepart", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Users size={14} /> Nombre de personnes
                </label>
                <select value={form.nbPersonnes} onChange={(e) => update("nbPersonnes", parseInt(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]">
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>

              <h3 className="text-lg font-bold text-[#0f2340] mb-4">
                {form.dateArrivee && form.dateDepart && nuits > 0
                  ? `Chambres disponibles (${nuits} nuit${nuits > 1 ? "s" : ""})`
                  : "Sélectionnez vos dates pour voir les chambres"}
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 size={20} className="animate-spin mr-2" /> Vérification des disponibilités...
                </div>
              ) : chambres.length === 0 && nuits > 0 ? (
                <p className="text-center py-6 text-orange-500 text-sm font-medium">
                  Aucune chambre disponible pour ces dates. Essayez d&apos;autres dates.
                </p>
              ) : (
                <div className="space-y-3">
                  {chambres.map((c) => (
                    <label key={c.id} className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${form.chambreId === c.id ? "border-[#1e3a5f] bg-[#1e3a5f]/5" : "border-gray-100 hover:border-gray-300"}`}>
                      <input type="radio" name="chambre" value={c.id} checked={form.chambreId === c.id}
                        onChange={() => update("chambreId", c.id)} className="sr-only" />
                      {c.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.images[0]} alt={c.nom} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-[#0f2340] text-sm">{c.nom}</div>
                            <div className="text-gray-400 text-xs">{typeLabel[c.type]} · {c.capacite} pers. max.</div>
                          </div>
                          <div className="text-[#c9a84c] font-bold text-lg">${c.prix}<span className="text-gray-400 text-xs font-normal">/nuit</span></div>
                        </div>
                      </div>
                      {form.chambreId === c.id && <CheckCircle size={18} className="text-[#1e3a5f] shrink-0 mt-1" />}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 1 */}
          {etape === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-[#0f2340] mb-6">Vos informations</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input type="text" value={form.prenom} onChange={(e) => update("prenom", e.target.value)} placeholder="Jean"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input type="text" value={form.nom} onChange={(e) => update("nom", e.target.value)} placeholder="Dupont"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jean@exemple.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} placeholder="+509 ..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                  <input type="text" value={form.nationalite} onChange={(e) => update("nationalite", e.target.value)} placeholder="Haïtienne"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Demandes spéciales</label>
                  <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3}
                    placeholder="Arrivée tardive, chambre non-fumeur..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {etape === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-[#0f2340] mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-[#c9a84c]" /> Mode de paiement
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { val: "STRIPE",  label: "Carte bancaire (Visa / Mastercard)", desc: "Paiement sécurisé via Stripe" },
                  { val: "CASH",    label: "Paiement à l'arrivée (Cash)",        desc: "Payez en espèces lors du check-in" },
                  { val: "MONCASH", label: "MonCash",                            desc: "Paiement mobile haïtien" },
                ].map((m) => (
                  <label key={m.val} className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${form.methodePaiement === m.val ? "border-[#1e3a5f] bg-[#1e3a5f]/5" : "border-gray-100 hover:border-gray-300"}`}>
                    <input type="radio" name="paiement" value={m.val} checked={form.methodePaiement === m.val}
                      onChange={() => update("methodePaiement", m.val)} className="mt-1" />
                    <div>
                      <div className="font-semibold text-[#0f2340] text-sm">{m.label}</div>
                      <div className="text-gray-400 text-xs">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 - Confirmation */}
          {etape === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#0f2340] mb-3">Réservation Confirmée !</h2>
              <p className="text-gray-500 mb-6">
                Merci <strong>{form.prenom} {form.nom}</strong> ! Votre réservation a été enregistrée.
                {form.email && <> Un email de confirmation sera envoyé à <strong>{form.email}</strong>.</>}
              </p>
              <div className="bg-gray-50 rounded-xl p-6 text-left mb-6 space-y-2 text-sm">
                {reservationId && <div className="flex justify-between"><span className="text-gray-500">N° réservation</span><span className="font-mono text-xs">{reservationId.slice(0, 8).toUpperCase()}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Chambre</span><span className="font-semibold">{chambreSelectionnee?.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Arrivée</span><span className="font-semibold">{form.dateArrivee}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Départ</span><span className="font-semibold">{form.dateDepart}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Durée</span><span className="font-semibold">{nuits} nuit{nuits > 1 ? "s" : ""}</span></div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold text-[#0f2340]">Total</span>
                  <span className="font-bold text-[#c9a84c] text-lg">${total}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Check-in : 14h00 | Check-out : 11h30 | +509 4284-8445</p>
            </div>
          )}

          {/* Navigation */}
          {etape < 3 && (
            <div className="flex gap-4 mt-6">
              {etape > 0 && (
                <button onClick={() => setEtape(etape - 1)}
                  className="flex-1 border-2 border-[#1e3a5f] text-[#1e3a5f] font-semibold py-3 rounded-xl hover:bg-[#1e3a5f]/5 transition-colors">
                  Retour
                </button>
              )}
              <button
                onClick={etape === 2 ? handleSubmit : () => setEtape(etape + 1)}
                disabled={!peutContinuer() || submitting}
                className="flex-1 bg-[#1e3a5f] hover:bg-[#0f2340] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Traitement...</> : etape === 2 ? "Confirmer la réservation" : "Continuer →"}
              </button>
            </div>
          )}
        </div>

        {/* Récapitulatif sidebar */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-36">
            <h3 className="font-bold text-[#0f2340] mb-4">Récapitulatif</h3>
            {chambreSelectionnee ? (
              <>
                {chambreSelectionnee.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={chambreSelectionnee.images[0]} alt={chambreSelectionnee.nom}
                    className="w-full h-32 object-cover rounded-lg mb-4" />
                )}
                <div className="font-semibold text-[#0f2340] mb-1">{chambreSelectionnee.nom}</div>
                <div className="text-gray-400 text-xs mb-4">{form.nbPersonnes} personne{form.nbPersonnes > 1 ? "s" : ""}</div>
                {nuits > 0 && (
                  <div className="border-t pt-4 space-y-2 text-sm">
                    {form.dateArrivee && <div className="flex justify-between text-gray-500"><span>Arrivée</span><span>{form.dateArrivee}</span></div>}
                    {form.dateDepart  && <div className="flex justify-between text-gray-500"><span>Départ</span><span>{form.dateDepart}</span></div>}
                    <div className="flex justify-between text-gray-500"><span>${chambreSelectionnee.prix} × {nuits} nuits</span><span>${total}</span></div>
                    <div className="flex justify-between font-bold text-[#0f2340] border-t pt-2 text-base">
                      <span>Total</span>
                      <span className="text-[#c9a84c]">${total}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                Sélectionnez une chambre pour voir le récapitulatif
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
