import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nirabelle Hôtel & Pool — Trou du Nord",
  description:
    "Nirabelle Hôtel & Pool, votre complexe hôtelier de référence à Trou du Nord, Haïti. Chambres confortables, piscine, restaurant et bar.",
  keywords: "hôtel, Trou du Nord, Haïti, piscine, réservation, Nirabelle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
