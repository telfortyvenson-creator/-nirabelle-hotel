import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrix(montant: number): string {
  return new Intl.NumberFormat("fr-HT", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(montant);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function nombreNuits(dateArrivee: Date | string, dateDepart: Date | string): number {
  const arrivee = new Date(dateArrivee);
  const depart = new Date(dateDepart);
  const diff = depart.getTime() - arrivee.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
