import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Bantargebang Times",
    template: "%s | Bantargebang Times",
  },
  description:
    "Berita terkini seputar Bantargebang dan sekitarnya. Cepat, akurat, dan terpercaya.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bantargebangtimes.com"
  ),
  openGraph: {
    siteName: "Bantargebang Times",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geist.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
