import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: "postgresql://postgres@localhost:5432/nirabelle_hotel" });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Nirabelle Hôtel...");

  // ── Users (staff) ───────────────────────────────────────────
  const adminPwd = await bcrypt.hash("admin123", 10);
  const receptPwd = await bcrypt.hash("recept123", 10);

  await db.user.upsert({
    where: { email: "admin@nirabelle.ht" },
    update: {},
    create: { email: "admin@nirabelle.ht", password: adminPwd, name: "Administrateur", role: "ADMIN" },
  });
  await db.user.upsert({
    where: { email: "reception@nirabelle.ht" },
    update: {},
    create: { email: "reception@nirabelle.ht", password: receptPwd, name: "Réception", role: "RECEPTIONIST" },
  });
  console.log("✅ Users créés");

  // ── Chambres ────────────────────────────────────────────────
  const chambresData = [
    // Standard (étage 1)
    { numero: "101", type: "STANDARD" as const, nom: "Chambre Standard", description: "Chambre confortable avec lit double, climatisation individuelle, salle de bain privée avec douche, minibar et TV satellite.", prix: 29, capacite: 2, superficie: 22, etage: 1, equipements: ["Lit double", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Salle de bain privée", "Coffre-fort"], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"] },
    { numero: "102", type: "STANDARD" as const, nom: "Chambre Standard", description: "Chambre confortable avec lit double, climatisation individuelle, salle de bain privée avec douche, minibar et TV satellite.", prix: 29, capacite: 2, superficie: 22, etage: 1, equipements: ["Lit double", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Salle de bain privée", "Coffre-fort"], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"] },
    { numero: "103", type: "STANDARD" as const, nom: "Chambre Standard", description: "Chambre confortable avec lit double, climatisation individuelle, salle de bain privée avec douche, minibar et TV satellite.", prix: 29, capacite: 2, superficie: 22, etage: 1, equipements: ["Lit double", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Salle de bain privée", "Coffre-fort"], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"] },
    { numero: "104", type: "STANDARD" as const, nom: "Chambre Standard", description: "Chambre confortable avec lit double, climatisation individuelle, salle de bain privée avec douche, minibar et TV satellite.", prix: 29, capacite: 2, superficie: 22, etage: 1, equipements: ["Lit double", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Salle de bain privée", "Coffre-fort"], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"] },
    // Deluxe (étage 2)
    { numero: "201", type: "DELUXE" as const, nom: "Chambre Deluxe", description: "Chambre spacieuse avec vue sur la piscine, lit King Size, coin salon, baignoire et accès piscine inclus.", prix: 55, capacite: 2, superficie: 32, etage: 2, equipements: ["Lit King Size", "Vue piscine", "Coin salon", "Baignoire", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Accès piscine"], images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"] },
    { numero: "202", type: "DELUXE" as const, nom: "Chambre Deluxe", description: "Chambre spacieuse avec vue sur la piscine, lit King Size, coin salon, baignoire et accès piscine inclus.", prix: 55, capacite: 2, superficie: 32, etage: 2, equipements: ["Lit King Size", "Vue piscine", "Coin salon", "Baignoire", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Accès piscine"], images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"] },
    { numero: "203", type: "DELUXE" as const, nom: "Chambre Deluxe", description: "Chambre spacieuse avec vue sur la piscine, lit King Size, coin salon, baignoire et accès piscine inclus.", prix: 55, capacite: 2, superficie: 32, etage: 2, equipements: ["Lit King Size", "Vue piscine", "Coin salon", "Baignoire", "Climatisation", "TV Satellite", "WiFi gratuit", "Minibar", "Accès piscine"], images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"] },
    // Suite Junior (étage 3)
    { numero: "301", type: "SUITE" as const, nom: "Suite Junior", description: "Suite élégante avec salon séparé, dressing et salle de bain luxueuse avec bain à remous. Room service prioritaire et panier de bienvenue inclus.", prix: 90, capacite: 3, superficie: 48, etage: 3, equipements: ["Salon séparé", "Bain à remous", "Dressing", "Room service", "Panier bienvenue", "Lit King Size", "Climatisation", "TV 55\"", "WiFi gratuit", "Minibar premium"], images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"] },
    { numero: "302", type: "SUITE" as const, nom: "Suite Junior", description: "Suite élégante avec salon séparé, dressing et salle de bain luxueuse avec bain à remous. Room service prioritaire et panier de bienvenue inclus.", prix: 90, capacite: 3, superficie: 48, etage: 3, equipements: ["Salon séparé", "Bain à remous", "Dressing", "Room service", "Panier bienvenue", "Lit King Size", "Climatisation", "TV 55\"", "WiFi gratuit", "Minibar premium"], images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"] },
    // Suite Présidentielle (étage 4)
    { numero: "401", type: "SUITE_PRESIDENTIELLE" as const, nom: "Suite Présidentielle", description: "Notre suite la plus prestigieuse : 2 chambres, grand salon, terrasse privée vue panoramique, cuisine équipée et butler dédié.", prix: 150, capacite: 4, superficie: 80, etage: 4, equipements: ["2 chambres", "Terrasse privée", "Vue panoramique", "Cuisine équipée", "Butler dédié", "Jacuzzi", "2 salles de bain", "Salle à manger", "WiFi premium"], images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80"] },
  ];

  for (const ch of chambresData) {
    await db.chambre.upsert({
      where: { numero: ch.numero },
      update: {},
      create: ch,
    });
  }
  console.log(`✅ ${chambresData.length} chambres créées`);

  // ── Clients de démo ─────────────────────────────────────────
  const clientsData = [
    { nom: "Dupont", prenom: "Pierre", email: "pierre.dupont@email.com", telephone: "+509 3712-3456", nationalite: "Française" },
    { nom: "Joseph", prenom: "Marie", email: "marie.joseph@email.com", telephone: "+509 4821-9876", nationalite: "Haïtienne" },
    { nom: "Baptiste", prenom: "Jean", email: "jean.baptiste@email.com", telephone: "+509 2345-6789", nationalite: "Haïtienne" },
    { nom: "Martin", prenom: "Sophie", email: "sophie.martin@email.com", telephone: "+509 3211-4567", nationalite: "Française" },
  ];

  const clients: Record<string, { id: string }> = {};
  for (const cl of clientsData) {
    const c = await db.client.upsert({
      where: { email: cl.email },
      update: {},
      create: cl,
    });
    clients[cl.email] = c;
  }
  console.log(`✅ ${clientsData.length} clients créés`);

  // ── Réservations de démo ─────────────────────────────────────
  const ch101 = await db.chambre.findUnique({ where: { numero: "101" } });
  const ch201 = await db.chambre.findUnique({ where: { numero: "201" } });
  const ch301 = await db.chambre.findUnique({ where: { numero: "301" } });

  if (ch101 && ch201 && ch301) {
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const in3 = new Date(today); in3.setDate(today.getDate() + 3);
    const in5 = new Date(today); in5.setDate(today.getDate() + 5);
    const in7 = new Date(today); in7.setDate(today.getDate() + 7);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

    const reservations = [
      { chambreId: ch101.id, clientId: clients["pierre.dupont@email.com"].id, dateArrivee: today, dateDepart: tomorrow, nbPersonnes: 1, statut: "CHECKIN" as const, source: "SUR_PLACE" as const, montantTotal: 29, montantPaye: 29 },
      { chambreId: ch201.id, clientId: clients["marie.joseph@email.com"].id, dateArrivee: today, dateDepart: in3, nbPersonnes: 2, statut: "CONFIRMEE" as const, source: "EN_LIGNE" as const, montantTotal: 165, montantPaye: 0 },
      { chambreId: ch301.id, clientId: clients["jean.baptiste@email.com"].id, dateArrivee: tomorrow, dateDepart: in5, nbPersonnes: 2, statut: "EN_ATTENTE" as const, source: "EN_LIGNE" as const, montantTotal: 360, montantPaye: 0 },
      { chambreId: ch101.id, clientId: clients["sophie.martin@email.com"].id, dateArrivee: in5, dateDepart: in7, nbPersonnes: 1, statut: "CONFIRMEE" as const, source: "TELEPHONE" as const, montantTotal: 58, montantPaye: 0 },
    ];

    for (const r of reservations) {
      await db.reservation.create({ data: r });
    }
    // Mettre à jour statut chambre 101 → OCCUPEE
    await db.chambre.update({ where: { numero: "101" }, data: { statut: "OCCUPEE" } });
    await db.chambre.update({ where: { numero: "302" }, data: { statut: "MAINTENANCE" } });
    console.log(`✅ ${reservations.length} réservations de démo créées`);
  }

  console.log("🎉 Seed terminé !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
