import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak, Header, Footer,
  convertInchesToTwip,
} from "docx";
import { writeFileSync } from "fs";

// ── Couleurs ──────────────────────────────────────────────────────────
const NAVY  = "1E3A5F";
const GOLD  = "C9A84C";
const LIGHT = "EAF0F8";
const WHITE = "FFFFFF";
const GRAY  = "F5F5F5";
const DARK  = "1A1A1A";

// ── Helpers ───────────────────────────────────────────────────────────
const sp = (n = 1) => new Paragraph({ text: "", spacing: { after: n * 80 } });

function title(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 52, color: WHITE, font: "Calibri" })],
    alignment: AlignmentType.CENTER,
    shading: { type: ShadingType.SOLID, color: NAVY, fill: NAVY },
    spacing: { before: 200, after: 200 },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
  });
}

function heading1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 34, color: WHITE, font: "Calibri" })],
    heading: HeadingLevel.HEADING_1,
    shading: { type: ShadingType.SOLID, color: NAVY, fill: NAVY },
    spacing: { before: 300, after: 160 },
    indent: { left: convertInchesToTwip(0.15) },
  });
}

function heading2(text) {
  return new Paragraph({
    children: [new TextRun({ text: "▸ " + text, bold: true, size: 26, color: NAVY, font: "Calibri" })],
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD } },
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Calibri", color: DARK, ...opts })],
    spacing: { after: 100 },
  });
}

function bullet(text, indent = 0) {
  return new Paragraph({
    children: [new TextRun({ text: "• " + text, size: 22, font: "Calibri", color: DARK })],
    indent: { left: convertInchesToTwip(0.3 + indent * 0.25) },
    spacing: { after: 80 },
  });
}

function infoBox(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 22, font: "Calibri", color: NAVY }),
      new TextRun({ text: value, size: 22, font: "Calibri", color: DARK }),
    ],
    spacing: { after: 100 },
    shading: { type: ShadingType.SOLID, color: LIGHT, fill: LIGHT },
    indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
  });
}

function cell(text, opts = {}) {
  const {
    bold = false, bg = WHITE, color = DARK, align = AlignmentType.LEFT,
    size = 20, colspan = 1,
  } = opts;
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size, font: "Calibri", color })],
      alignment: align,
      spacing: { before: 60, after: 60 },
    })],
    shading: { type: ShadingType.SOLID, color: bg, fill: bg },
    columnSpan: colspan,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
  });
}

function tableHeader(cols) {
  return new TableRow({
    children: cols.map(c =>
      cell(c, { bold: true, bg: NAVY, color: WHITE, align: AlignmentType.CENTER, size: 21 })
    ),
    tableHeader: true,
  });
}

// ── TABLE BUDGET ──────────────────────────────────────────────────────
const lignesBudget = [
  { cat: "🎨 Design & UX",                desc: "Maquettes, charte graphique, identité visuelle hôtel", prix: 200 },
  { cat: "🏠 Pages publiques (6)",         desc: "Accueil, Chambres, Galerie, À propos, Contact, Réservation", prix: 380 },
  { cat: "🔐 Authentification admin",       desc: "NextAuth v5, gestion sessions JWT, login sécurisé", prix: 150 },
  { cat: "📊 Dashboard admin",             desc: "Statistiques temps réel, taux occupation, revenus", prix: 180 },
  { cat: "📅 Gestion réservations",        desc: "Liste, filtres, check-in/checkout, annulation", prix: 200 },
  { cat: "🛏️ Gestion chambres",            desc: "Statut live, modification, disponibilité par date", prix: 160 },
  { cat: "👥 Gestion clients",             desc: "Historique, recherche, total dépenses", prix: 100 },
  { cat: "📆 Calendrier occupations",      desc: "Vue mensuelle interactive avec navigation", prix: 130 },
  { cat: "➕ Nouvelle réservation (admin)", desc: "Formulaire complet avec détection chambre dispo", prix: 140 },
  { cat: "⚙️ Panneau Paramètres (6 onglets)", desc: "Logo, texte, hero, galerie, chambres, services", prix: 250 },
  { cat: "🗄️ Base de données Prisma/PostgreSQL", desc: "Schéma, migrations, seed, adapter PG", prix: 180 },
  { cat: "🔌 API REST complète (14 routes)", desc: "Chambres, réservations, clients, dashboard, upload", prix: 200 },
  { cat: "📷 Upload & gestion médias",     desc: "Upload images, gestion galerie, images chambres", prix: 130 },
  { cat: "🧪 Tests & débogage",            desc: "Tests fonctionnels, corrections erreurs Edge runtime, build", prix: 100 },
];

const totalLignes = lignesBudget.reduce((s, l) => s + l.prix, 0);
const ajustement  = 2500 - totalLignes;  // pour arriver exactement à 2500

// ── DOCUMENT ─────────────────────────────────────────────────────────
const doc = new Document({
  creator: "Nirabelle Hôtel",
  title: "Présentation Projet — Site Web Nirabelle Hôtel & Pool",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },

      // ── En-tête ──────────────────────────────────────────────────
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Nirabelle Hôtel & Pool  —  Projet Site Web", size: 18, color: NAVY, font: "Calibri" }),
                new TextRun({ text: "  |  Confidentiel", size: 18, color: "999999", font: "Calibri" }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD } },
            }),
          ],
        }),
      },

      // ── Pied de page ─────────────────────────────────────────────
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "© 2026 Nirabelle Hôtel & Pool, Trou du Nord, Haïti", size: 18, color: "999999", font: "Calibri" }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD } },
            }),
          ],
        }),
      },

      children: [

        // ════════════════════════════════════════════════════════════
        // PAGE DE TITRE
        // ════════════════════════════════════════════════════════════
        sp(2),
        new Paragraph({
          children: [new TextRun({ text: "NIRABELLE HÔTEL & POOL", bold: true, size: 64, color: NAVY, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Trou du Nord, Haïti", size: 28, color: GOLD, font: "Calibri", italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: "─────────────────────────────────────────",
            color: GOLD, size: 24, font: "Calibri",
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "PRÉSENTATION DU PROJET", bold: true, size: 40, color: NAVY, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Site Web & Système de Gestion Hôtelière", size: 28, color: DARK, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Fiche synthèse
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [
              cell("Client",         { bold: true, bg: LIGHT, color: NAVY }),
              cell("Nirabelle Hôtel & Pool",  { bg: WHITE }),
            ]}),
            new TableRow({ children: [
              cell("Localisation",   { bold: true, bg: LIGHT, color: NAVY }),
              cell("Trou du Nord, Haïti",     { bg: WHITE }),
            ]}),
            new TableRow({ children: [
              cell("Type de projet", { bold: true, bg: LIGHT, color: NAVY }),
              cell("Site vitrine + Système de gestion (PMS)", { bg: WHITE }),
            ]}),
            new TableRow({ children: [
              cell("Technologies",   { bold: true, bg: LIGHT, color: NAVY }),
              cell("Next.js 15, TypeScript, PostgreSQL, Prisma, Tailwind CSS", { bg: WHITE }),
            ]}),
            new TableRow({ children: [
              cell("Date",           { bold: true, bg: LIGHT, color: NAVY }),
              cell("Juin 2026",                                { bg: WHITE }),
            ]}),
            new TableRow({ children: [
              cell("Budget total",   { bold: true, bg: GOLD, color: WHITE }),
              cell("2 500 USD",      { bold: true, bg: GOLD, color: WHITE }),
            ]}),
          ],
        }),

        sp(3),
        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 1. PRÉSENTATION DU PROJET
        // ════════════════════════════════════════════════════════════
        heading1("1. PRÉSENTATION DU PROJET"),
        sp(),

        heading2("1.1 Contexte & Objectifs"),
        body("Nirabelle Hôtel & Pool est un complexe hôtelier situé à Trou du Nord, dans le Nord-Est d'Haïti. L'établissement dispose de chambres modernes, d'une piscine extérieure, d'un restaurant et d'un bar."),
        sp(),
        body("Le projet consiste en la création complète d'un site web professionnel couplé à un système de gestion hôtelière interne (PMS — Property Management System) permettant :"),
        bullet("La présentation de l'hôtel au grand public avec possibilité de réservation en ligne"),
        bullet("La gestion quotidienne des réservations, chambres, clients et finances par le personnel"),
        bullet("La personnalisation du contenu du site par les administrateurs sans intervention technique"),
        sp(),

        heading2("1.2 Périmètre de la solution"),
        body("La solution livrée est divisée en deux espaces distincts :"),
        sp(),
        infoBox("Site public", "Interface client accessible à tous les visiteurs pour découvrir l'hôtel et effectuer des réservations en ligne"),
        infoBox("Espace admin", "Tableau de bord sécurisé réservé au personnel pour gérer toutes les opérations hôtelières"),
        sp(2),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 2. FONCTIONNALITÉS — SITE PUBLIC
        // ════════════════════════════════════════════════════════════
        heading1("2. FONCTIONNALITÉS — SITE PUBLIC"),
        sp(),

        heading2("2.1 Pages du site"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(["Page", "Description"]),
            new TableRow({ children: [cell("🏠 Accueil"), cell("Hero dynamique, services, chambres vedettes, section piscine, CTA réservation")] }),
            new TableRow({ children: [cell("🛏️ Chambres"), cell("Liste de toutes les chambres avec filtres, photos, prix et bouton réservation")] }),
            new TableRow({ children: [cell("📷 Galerie"), cell("Grille masonry de photos filtrables par catégorie (Hôtel, Piscine, Chambres…)")] }),
            new TableRow({ children: [cell("ℹ️ À propos"), cell("Histoire de l'hôtel, équipe, valeurs, localisation Google Maps")] }),
            new TableRow({ children: [cell("📞 Contact"), cell("Formulaire de contact, adresse, téléphone, horaires")] }),
            new TableRow({ children: [cell("📅 Réservation"), cell("Formulaire 4 étapes : dates → informations → paiement → confirmation")] }),
          ],
        }),
        sp(),

        heading2("2.2 Formulaire de réservation en ligne"),
        bullet("Étape 1 — Sélection des dates d'arrivée/départ et nombre de personnes"),
        bullet("Étape 2 — Affichage en temps réel des chambres disponibles avec photos et prix"),
        bullet("Étape 3 — Saisie des informations personnelles du client"),
        bullet("Étape 4 — Choix du mode de paiement (Carte Visa/Mastercard, Cash, MonCash)"),
        bullet("Confirmation avec numéro de réservation unique"),
        sp(2),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 3. FONCTIONNALITÉS — ESPACE ADMIN
        // ════════════════════════════════════════════════════════════
        heading1("3. FONCTIONNALITÉS — ESPACE ADMIN"),
        sp(),

        heading2("3.1 Dashboard"),
        bullet("Vue synthétique : taux d'occupation, revenus du jour/mois, réservations en attente"),
        bullet("Compteurs : chambres disponibles / occupées / en maintenance"),
        bullet("Alertes check-in et check-out du jour"),
        sp(),

        heading2("3.2 Gestion des réservations"),
        bullet("Liste complète avec filtres par statut, date, source (en ligne / sur place / téléphone)"),
        bullet("Actions rapides : confirmer, check-in, check-out, annuler"),
        bullet("Détail complet de chaque réservation avec informations client"),
        bullet("Historique des paiements associés"),
        sp(),

        heading2("3.3 Nouvelle réservation (sur place)"),
        bullet("Sélection des dates → affichage automatique des chambres disponibles"),
        bullet("Création ou recherche du client dans la base"),
        bullet("Saisie du montant et mode de paiement (Cash, MonCash, Virement)"),
        sp(),

        heading2("3.4 Gestion des chambres"),
        bullet("Vue d'ensemble avec statut coloré (Disponible / Occupée / Maintenance)"),
        bullet("Changement de statut en un clic"),
        bullet("Modification des informations : nom, prix, description, équipements"),
        sp(),

        heading2("3.5 Calendrier des occupations"),
        bullet("Vue mensuelle avec navigation mois par mois"),
        bullet("Coloration par statut de réservation"),
        bullet("Accès rapide au détail de chaque occupation"),
        sp(),

        heading2("3.6 Gestion des clients"),
        bullet("Annuaire complet avec historique de séjours"),
        bullet("Recherche par nom, email ou téléphone"),
        bullet("Total des dépenses calculé automatiquement"),
        sp(),

        heading2("3.7 Panneau de paramètres (6 onglets)"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(["Onglet", "Fonctionnalités"]),
            new TableRow({ children: [cell("🏨 Hôtel"),       cell("Nom, adresse, téléphone, email, description, check-in/out")] }),
            new TableRow({ children: [cell("🎨 Logo & Texte"), cell("Logo image (upload/URL), texte ligne 1 et 2, aperçu en direct")] }),
            new TableRow({ children: [cell("🖼️ Apparence"),   cell("Image de fond du hero — URL ou upload de fichier")] }),
            new TableRow({ children: [cell("📷 Galerie"),      cell("Ajouter, supprimer, réordonner les photos (upload ou URL)")] }),
            new TableRow({ children: [cell("🛏️ Chambres"),     cell("Par chambre : prix, images, description, équipements, capacité")] }),
            new TableRow({ children: [cell("✨ Services"),      cell("Liste des services affichés sur l'accueil (ajout/suppression)")] }),
          ],
        }),
        sp(2),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 4. ARCHITECTURE TECHNIQUE
        // ════════════════════════════════════════════════════════════
        heading1("4. ARCHITECTURE TECHNIQUE"),
        sp(),

        heading2("4.1 Stack technologique"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(["Couche", "Technologie", "Rôle"]),
            new TableRow({ children: [cell("Frontend"),      cell("Next.js 15 + React 19"),   cell("Pages, composants, rendu serveur (RSC)")] }),
            new TableRow({ children: [cell("Langage"),       cell("TypeScript"),               cell("Typage fort, sécurité code")] }),
            new TableRow({ children: [cell("Style"),         cell("Tailwind CSS v4"),          cell("Design responsive, couleurs hôtel")] }),
            new TableRow({ children: [cell("Base de données"), cell("PostgreSQL 18"),          cell("Stockage données hôtelières")] }),
            new TableRow({ children: [cell("ORM"),           cell("Prisma 7"),                 cell("Modèles, migrations, requêtes")] }),
            new TableRow({ children: [cell("Auth"),          cell("NextAuth v5 (JWT)"),        cell("Sessions admin sécurisées")] }),
            new TableRow({ children: [cell("API"),           cell("Next.js API Routes"),       cell("14 endpoints REST")] }),
            new TableRow({ children: [cell("Paiement"),      cell("Stripe"),                   cell("Paiement carte en ligne")] }),
          ],
        }),
        sp(),

        heading2("4.2 Base de données — Modèles"),
        bullet("Chambre — type, prix, images, équipements, statut, réservations"),
        bullet("Reservation — dates, statut, source, montant, paiements liés"),
        bullet("Client — informations personnelles, historique séjours"),
        bullet("Paiement — montant, méthode (Stripe/Cash/MonCash/Virement), référence"),
        bullet("User — authentification admin avec rôles (Super Admin / Admin / Réceptionniste)"),
        bullet("Parametre — configuration clé-valeur (logo, hero, services, etc.)"),
        bullet("GaleriePhoto — photos galerie avec catégorie et ordre d'affichage"),
        sp(),

        heading2("4.3 Sécurité"),
        bullet("Authentification JWT (JSON Web Token) avec NextAuth v5"),
        bullet("Mots de passe hashés avec bcryptjs"),
        bullet("Protection middleware sur toutes les routes /admin/*"),
        bullet("Validation des données côté serveur avant insertion en base"),
        bullet("Isolation Edge Runtime / Node.js pour compatibilité maximale"),
        sp(2),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 5. BUDGET DÉTAILLÉ
        // ════════════════════════════════════════════════════════════
        heading1("5. BUDGET DÉTAILLÉ"),
        sp(),

        body("Le tableau suivant présente la décomposition du budget total pour la réalisation complète du projet.", { color: "555555" }),
        sp(),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(["Poste", "Description", "Montant (USD)"]),
            ...lignesBudget.map((l, i) =>
              new TableRow({
                children: [
                  cell(l.cat, { bold: true, bg: i % 2 === 0 ? GRAY : WHITE }),
                  cell(l.desc, { bg: i % 2 === 0 ? GRAY : WHITE }),
                  cell("$" + l.prix.toLocaleString(), { align: AlignmentType.RIGHT, bg: i % 2 === 0 ? GRAY : WHITE }),
                ],
              })
            ),
            ...(ajustement !== 0 ? [new TableRow({
              children: [
                cell("⚙️ Ajustement / Gestion de projet",  { bold: true, bg: LIGHT }),
                cell("Coordination, révisions, déploiement",    { bg: LIGHT }),
                cell("$" + Math.abs(ajustement), { align: AlignmentType.RIGHT, bg: LIGHT }),
              ],
            })] : []),
            new TableRow({
              children: [
                cell("TOTAL", { bold: true, bg: NAVY, color: WHITE, size: 24 }),
                cell("",      { bg: NAVY }),
                cell("$2 500 USD", { bold: true, bg: GOLD, color: WHITE, align: AlignmentType.RIGHT, size: 24 }),
              ],
            }),
          ],
        }),
        sp(),

        heading2("Conditions de paiement"),
        infoBox("Acompte au démarrage", "40%  —  $1 000 USD"),
        infoBox("Livraison intermédiaire", "30%  —  $750 USD  (après livraison du site public)"),
        infoBox("Livraison finale", "30%  —  $750 USD  (après livraison de l'espace admin complet)"),
        sp(),
        body("💳 Modes de paiement acceptés : Virement bancaire, MonCash, Zelle, PayPal", { color: "555555", italics: true }),
        sp(2),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 6. LIVRABLES & CALENDRIER
        // ════════════════════════════════════════════════════════════
        heading1("6. LIVRABLES & CALENDRIER"),
        sp(),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(["Phase", "Livrables", "Durée estimée"]),
            new TableRow({ children: [
              cell("Phase 1 — Fondations", { bold: true }),
              cell("Structure projet, base de données, authentification admin"),
              cell("1 semaine", { align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [
              cell("Phase 2 — Site public", { bold: true, bg: GRAY }),
              cell("6 pages publiques + formulaire réservation connecté", { bg: GRAY }),
              cell("1-2 semaines", { align: AlignmentType.CENTER, bg: GRAY }),
            ]}),
            new TableRow({ children: [
              cell("Phase 3 — Espace admin", { bold: true }),
              cell("Dashboard, réservations, chambres, clients, calendrier"),
              cell("1-2 semaines", { align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [
              cell("Phase 4 — Paramètres", { bold: true, bg: GRAY }),
              cell("Panneau admin complet : logo, galerie, chambres, services", { bg: GRAY }),
              cell("1 semaine", { align: AlignmentType.CENTER, bg: GRAY }),
            ]}),
            new TableRow({ children: [
              cell("Phase 5 — Livraison", { bold: true }),
              cell("Tests, corrections, déploiement, formation personnel"),
              cell("3-5 jours", { align: AlignmentType.CENTER }),
            ]}),
          ],
        }),
        sp(),

        heading2("Ce qui est inclus"),
        bullet("Code source complet livré sur dépôt Git privé"),
        bullet("Documentation technique d'utilisation"),
        bullet("1 mois de support après livraison"),
        bullet("Formation du personnel (2h) pour utilisation du panneau admin"),
        bullet("Déploiement initial sur serveur de votre choix"),
        sp(),

        heading2("Ce qui n'est pas inclus"),
        bullet("Hébergement serveur (coût mensuel à la charge du client)"),
        bullet("Nom de domaine (coût annuel à la charge du client)"),
        bullet("Clé API Stripe (compte à créer par le client)"),
        bullet("Contenu textuel et photos (fournis par le client)"),
        sp(2),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // 7. GARANTIES & SUPPORT
        // ════════════════════════════════════════════════════════════
        heading1("7. GARANTIES & SUPPORT"),
        sp(),

        heading2("Garanties"),
        bullet("Code propre, documenté et maintenable"),
        bullet("Site responsive (mobile, tablette, desktop)"),
        bullet("Performance optimisée (Next.js Server Components, images optimisées)"),
        bullet("Sécurité : authentification forte, données chiffrées, protection CSRF"),
        bullet("Compatibilité navigateurs modernes (Chrome, Firefox, Safari, Edge)"),
        sp(),

        heading2("Support post-livraison"),
        infoBox("Durée", "1 mois inclus dans le prix"),
        infoBox("Couverture", "Corrections de bugs, ajustements mineurs, questions d'utilisation"),
        infoBox("Délai de réponse", "48 heures ouvrables"),
        sp(2),

        // ════════════════════════════════════════════════════════════
        // SIGNATURE
        // ════════════════════════════════════════════════════════════
        heading1("8. ACCEPTATION"),
        sp(),
        body("Ce document constitue la description complète du projet et du budget convenu entre les deux parties. En signant ci-dessous, le client confirme sa compréhension et son accord sur l'ensemble des éléments décrits."),
        sp(3),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [
              cell("Pour le client — Nirabelle Hôtel & Pool", { bold: true, bg: LIGHT, color: NAVY }),
              cell("Pour le prestataire", { bold: true, bg: LIGHT, color: NAVY }),
            ]}),
            new TableRow({ children: [
              new TableCell({
                children: [
                  new Paragraph({ text: "", spacing: { after: 400 } }),
                  new Paragraph({
                    children: [new TextRun({ text: "Signature & Date : _______________________", size: 20, font: "Calibri", color: "999999" })],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: "", spacing: { after: 400 } }),
                  new Paragraph({
                    children: [new TextRun({ text: "Signature & Date : _______________________", size: 20, font: "Calibri", color: "999999" })],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
              }),
            ]}),
          ],
        }),

        sp(3),
        new Paragraph({
          children: [new TextRun({ text: "Merci de votre confiance — Nirabelle Hôtel & Pool", size: 22, italics: true, color: GOLD, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

// ── Générer le fichier ────────────────────────────────────────────────
Packer.toBuffer(doc).then((buffer) => {
  const path = "Nirabelle_Hotel_Presentation_Budget.docx";
  writeFileSync(path, buffer);
  console.log("✅ Document généré : " + path);
});
