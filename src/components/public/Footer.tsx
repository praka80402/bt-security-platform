import Link from "next/link";
import { Shield, Phone, Mail, MapPin, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow">
                <img src="/images/logo.png" alt="Yash Enterprises Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-tight">
                  YASH<span className="text-blue-400">ENTERPRISES</span>
                </span>
                <span className="text-xs font-bold text-amber-400 block tracking-tight">
                  Safety You Can See. Service You Can Trust.
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  bestcctvservice.com
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Complete electronic surveillance and time-attendance solutions. Sales, fast installation, doorstep repair, and comprehensive AMC contracts for homes, commercial complexes, factories, and schools.
            </p>
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" /> Certified CP Plus, Hikvision & eSSL Partner
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" /> 1-Year Comprehensive Warranty & Free Site Visits
              </div>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services" className="hover:text-white transition">HD & IP CCTV Camera Installation</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Camera Relocation & Cable Re-wiring</Link></li>
              <li><Link href="/services" className="hover:text-white transition">DVR / NVR HDD Replacement & Setup</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Biometric Fingerprint & Face Attendance</Link></li>
              <li><Link href="/services" className="hover:text-white transition">EM Lock & Access Control Systems</Link></li>
              <li><Link href="/amc" className="hover:text-white transition">Quarterly & Annual Maintenance (AMC)</Link></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Supported Brands</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products?brand=CP+Plus" className="hover:text-white transition">CP Plus Orange & Indigo</Link></li>
              <li><Link href="/products?brand=Hikvision" className="hover:text-white transition">Hikvision ColorVu & AcuSense</Link></li>
              <li><Link href="/products?brand=Dahua" className="hover:text-white transition">Dahua TiOC & 4K NVR</Link></li>
              <li><Link href="/products?brand=eSSL" className="hover:text-white transition">eSSL Time & Attendance</Link></li>
              <li><Link href="/products?brand=Matrix" className="hover:text-white transition">Matrix COSEC Access Control</Link></li>
              <li><Link href="/products?brand=Realtime" className="hover:text-white transition">Realtime Cloud Devices</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact & Office</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Yash Enterprises, Main Market Road, Commercial Complex, Ground Floor</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+91 93089 07319</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>yashenterprises.cctv@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Yash Enterprises (bestcctvservice.com). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/track" className="hover:text-white">Track Repair Status</Link>
            <Link href="/admin/login" className="hover:text-white text-slate-500">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}