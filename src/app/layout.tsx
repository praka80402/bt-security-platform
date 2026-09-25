import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://bestcctvservice.com'),
  title: "Yash Enterprises | CCTV Installation & Biometric Services in Patna, Bihar",
  description: "Yash Enterprises (bestcctvservice.com) provides CCTV installation, biometric attendance and AMC maintenance in Patna, Khagaul, Arrah, Buxar, Hajipur, Chapra, Muzaffarpur, Masaurhi, Barh, Bakhtiarpur, Jehanabad, Nalanda, Gaya and Gopalganj. Authorised CP Plus, Hikvision, Dahua and eSSL partner since 2016.",
  keywords: "cctv installation patna, biometric attendance bihar, cp plus dealer patna, hikvision patna, yash enterprises, amc cctv patna, best cctv service bihar",
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'PASTE_THE_TAG_FROM_SEARCH_CONSOLE_HERE',
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