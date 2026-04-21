import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Lora } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Bantargebang Daily",
    template: "%s | Bantargebang Daily",
  },
  description:
    "Berita terkini seputar Bantargebang dan sekitarnya. Cepat, akurat, dan terpercaya.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bantargebangdaily.com"
  ),
  openGraph: {
    siteName: "Bantargebang Daily",
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
    <html lang="id" className={`${geist.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
