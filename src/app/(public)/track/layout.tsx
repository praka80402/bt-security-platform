import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your CCTV Service Ticket | Yash Enterprises Patna",
  description: "Check the live status of your CCTV repair or installation service ticket.",
  alternates: { canonical: "/track" },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
