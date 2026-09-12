import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yash Enterprises | Best CCTV Service & Biometric Attendance Solutions",
  description: "Official portal for Yash Enterprises (bestcctvservice.com). HD & IP CCTV installation, biometric attendance systems, door access control, and 24/7 AMC maintenance.",
  keywords: "best cctv service, cctv installation, biometric attendance, cp plus, hikvision, essl, yash enterprises, amc cctv",
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