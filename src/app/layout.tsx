import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "HIS PRESENCE — Music Banquet '26 | Theos Tribe",
  description:
    "Register for Music Banquet '26 — HIS PRESENCE. Limited to 50 seats. Sunday 6th Nov 2026, 5PM, Abeokuta.",
  openGraph: {
    title: "HIS PRESENCE — Music Banquet '26",
    description: "Theos Tribe registration. Limited spaces. Compulsory registration.",
    images: ["/flyer.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
