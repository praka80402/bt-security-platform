import Link from "next/link";
import Image from "next/image";
import { Shield, Phone, Mail, MapPin, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow">
                <Image src="/images/logo.png" alt="Yash Enterprises Logo" width={48} height={48} className="w-full h-full object-contain" />
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
                <CheckCircle className="w-4 h-4 shrink-0" /> Certified CP Plus, Hikvision, Sparsh & eSSL Partner
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
              <li><Link href="/products?brand=Sparsh" className="hover:text-white transition">Sparsh NDAA Compliant</Link></li>
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
                <span>Plot No. 139, Amod Path, Adampur, Near Hanuman Asthan, Khagaul, Patna, Bihar 801105</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+91 9308907319</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>yash@bestcctvservice.com</span>
              </li>
            </ul>
            
            <div className="mt-6 flex flex-col items-center gap-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center">
              <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-sm shrink-0">
                <Image src="/images/review-qr.png" alt="Scan to Review us on Google" width={128} height={128} className="w-full h-full object-cover" />
              </div>
              <div className="w-full">
                <p className="text-sm font-bold text-white mb-1">Rate Your Experience!</p>
                <p className="text-[10px] text-slate-400 mb-3">Scan QR code to leave a Google Review</p>
                <a
                  href="https://g.page/r/CTM5PhyYtmlZEBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition uppercase tracking-wider w-full justify-center"
                >
                  Or Click Here
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Service Areas */}
        <div className="mb-10 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center max-w-4xl mx-auto">
          <h5 className="text-sm font-bold text-white mb-2 uppercase tracking-wide text-blue-400">Our Service Areas in Bihar</h5>
          <p className="text-sm text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Patna (Head Office)</strong>, Khagaul, Arrah, Buxar, Hajipur, Chapra, Muzaffarpur, Masaurhi, Barh, Bakhtiarpur, Jehanabad, Nalanda, Gaya, and Gopalganj.
          </p>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Yash Enterprises (bestcctvservice.com). All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
            <Link href="/track" className="hover:text-white">Track Repair Status</Link>
            <Link href="/admin/login" className="hover:text-white text-slate-500">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


