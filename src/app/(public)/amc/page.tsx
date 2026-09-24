import { CheckCircle2, Shield, MessageSquare, Award, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CCTV AMC Plans in Patna — Silver, Gold & Corporate | Yash Enterprises",
  description:
    "Annual maintenance contracts for CCTV in Patna from ₹3,499/year. Quarterly visits, 4-hour priority response, genuine spares. Serving Patna, Ara, Buxar, Hajipur and across Bihar.",
  alternates: { canonical: "/amc" },
};

export default function AmcPage() {
  const plans = [
    {
      name: "Silver AMC",
      target: "Homes & Small Shops",
      price: "₹3,499",
      period: "per year (Up to 4 Cameras)",
      features: [
        "4 Preventive Scheduled Visits/Year",
        "Quarterly Camera Lens & Dome Cleaning",
        "Free Labor for Cable Repairs",
        "Unlimited On-Call Troubleshooting",
        "Response Time: Within 8 Hours",
        "Spares & Hardware at Cost Price",
      ],
      popular: false,
      btnColor: "bg-slate-900 hover:bg-slate-800",
    },
    {
      name: "Gold Comprehensive AMC",
      target: "Offices, Societies & Warehouses",
      price: "₹8,999",
      period: "per year (Up to 16 Cameras)",
      features: [
        "6 Scheduled Preventive Visits/Year",
        "Bi-Monthly DVR/NVR Health Checks",
        "Biometric Device Calibration Included",
        "Priority Technician Dispatch (Within 4 Hrs)",
        "Zero Labor Charges for Any Shifting",
        "Surge / Power Supply Replacement Support",
      ],
      popular: true,
      btnColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Corporate Enterprise AMC",
      target: "Factories, Schools & Hospitals",
      price: "Custom Quote",
      period: "32+ Cameras & Access Control",
      features: [
        "Monthly Scheduled Maintenance Visits",
        "Dedicated Account Engineer",
        "Full Spare Parts Guarantee (Optional)",
        "Automated Biometric Payroll Data Backup",
        "2-Hour Emergency SLA",
        "Quarterly Comprehensive Audit Reports",
      ],
      popular: false,
      btnColor: "bg-slate-900 hover:bg-slate-800",
    },
  ];

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Annual Maintenance Contracts
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
            Zero-Downtime Surveillance AMC
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Ensure your cameras are always recording when it matters most. Yash Enterprises offers customized preventive maintenance packages for homes, societies, and enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`bg-white rounded-3xl p-8 border ${
                p.popular
                  ? "border-2 border-blue-600 shadow-2xl relative scale-105"
                  : "border-slate-200/80 shadow-md"
              } flex flex-col justify-between`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-2xl font-black text-slate-900">{p.name}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">{p.target}</p>
                
                <div className="my-6">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-500 block mt-1">{p.period}</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 font-medium pt-4 border-t border-slate-100">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href={`https://wa.me/919308907319?text=Hello%20Yash%20Enterprises,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(p.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-center text-xs flex items-center justify-center gap-2 transition ${p.btnColor} shadow-md`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Choose {p.name}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* AMC Benefits Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold">4-Hour SLA Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                AMC clients receive top priority. Our service engineer reaches your premises within 4 business hours.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold">Free Standby Equipment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If your DVR or camera requires workshop repair, we provide standby replacement equipment so recording never stops.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold">GST Invoicing & Compliance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                100% compliant documentation, signed visit log sheets, and proper GST tax invoices for commercial input tax credit.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}