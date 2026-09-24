import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book CCTV Installation & Repair in Patna — Same-Day Engineer Visit",
  description: "Get same-day CCTV repair, installation, and biometric setup in Patna. Experienced technicians from Yash Enterprises.",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
