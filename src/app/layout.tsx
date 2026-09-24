import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://bestcctvservice.com'),
  title: "Yash Enterprises | CCTV Installation & Biometric Services in Patna, Bihar",
  description: "Yash Enterprises (bestcctvservice.com) provides top CCTV installation, biometric attendance, and AMC maintenance in Patna, Ara, Buxar, Hajipur, Chapra, Muzaffarpur, Masaurhi, Gaya, Barh, and Bakhtiarpur.",
  keywords: "cctv installation patna, biometric attendance bihar, cp plus dealer patna, hikvision patna, yash enterprises, amc cctv patna, best cctv service bihar",
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}