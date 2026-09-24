import type { Metadata } from "next";
import TrackClient from "./TrackClient";

export const metadata: Metadata = {
  title: "Track Your CCTV Service Ticket | Yash Enterprises Patna",
  description:
    "Check the live status of your CCTV repair or installation ticket. " +
    "Enter your ticket number or registered phone number.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Live Ticket Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Track Your Service Request
          </h1>
          <p className="text-slate-600 text-sm">
            Enter your Ticket Number (e.g. <span className="font-semibold text-blue-600">TKT-1001</span>) or Registered Mobile Number
          </p>
        </div>
      </div>
      <TrackClient />
    </div>
  );
}