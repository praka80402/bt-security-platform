import Hero from "@/components/public/Hero";
import ServiceAreas from "@/components/public/ServiceAreas";
import EcosystemSection from "@/components/public/EcosystemSection";
import ClientsMarquee from "@/components/public/ClientsMarquee";
import Link from "next/link";
import { 
  Camera, 
  Fingerprint, 
  Wrench, 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  HardDrive
} from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await db.product.findMany({
      where: { featured: true },
      take: 4,
    });
  } catch (error) {
    console.error("Database query failed in HomePage:", error);
  }

  return (
    <>
      <Hero />

      {/* Brand Logos Trust Bar (Clean Light Theme) */}
      <section className="bg-slate-50 border-b border-slate-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs uppercase font-extrabold tracking-widest text-slate-700 mb-6">
            Authorized Sales, Installation & Service Partner For Leading Brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            <span className="text-xl md:text-2xl font-black tracking-wider text-slate-900 hover:scale-105 transition">CP PLUS</span>
            <span className="text-xl md:text-2xl font-black tracking-wider text-red-600 hover:scale-105 transition">HIKVISION</span>
            <span className="text-xl md:text-2xl font-black tracking-wider text-sky-700 hover:scale-105 transition">DAHUA</span>
            <span className="text-xl md:text-2xl font-black tracking-wider text-emerald-800 hover:scale-105 transition">eSSL</span>
            <span className="text-xl md:text-2xl font-black tracking-wider text-amber-900 hover:scale-105 transition">MATRIX</span>
            <span className="text-xl md:text-2xl font-black tracking-wider text-purple-800 hover:scale-105 transition">REALTIME</span>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Surveillance & Access Control
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            End-to-End Security & Attendance Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From individual home security cameras to factory-grade biometric attendance and automated access control, Yash Enterprises delivers dependable solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div id="service-cctv" className="scroll-mt-24 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">CCTV Camera Installation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Full HD & 4K IP camera setups for homes, shops, warehouses, and societies. Neat concealed wiring and instant mobile viewing app configuration.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Color night-vision options</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Remote view on phone/laptop</li>
            </ul>
            <div className="pt-2">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
                Book Installation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Service Card 2 */}
          <div id="service-biometric" className="scroll-mt-24 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Biometric Attendance & Access</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fingerprint, RFID card, and touchless AI face-recognition machines with payroll export software, EM magnetic door locks, and battery backup.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Excel/Cloud report</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automatic door locking system</li>
            </ul>
            <div className="pt-2">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700">
                Setup Biometrics <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Service Card 3 */}
          <div id="service-repair" className="scroll-mt-24 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">CCTV Repair & Relocation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Quick technician visit for camera blackout, DVR beeping sound, password reset, damaged BNC connector/cabling, or shifting cameras to a new address.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Doorstep visit in 4 hours</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Genuine spares & transparent pricing</li>
            </ul>
            <div className="pt-2">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700">
                Book Technician <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Service Card 4 */}
          <div id="service-amc" className="scroll-mt-24 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">AMC Maintenance Contracts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Keep your surveillance system active 365 days with quarterly lens cleaning, cable checks, power supply testing, and priority repair response.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Residential & Corporate AMC</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free routine maintenance visits</li>
            </ul>
            <div className="pt-2">
              <Link href="/amc" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                View AMC Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Service Card 5 */}
          <div id="service-storage" className="scroll-mt-24 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">DVR / NVR Storage Upgrades</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Surveillance-grade Western Digital Purple / Seagate SkyHawk hard disks (1TB to 10TB) with 30-to-90 days video recording backup.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3 Years Manufacturer Warranty</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Installation & format included</li>
            </ul>
            <div className="pt-2">
              <Link href="/products?category=NVR_DVR" className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700">
                View Storage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Service Card 6 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Society & Commercial Audits</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete security audit for residential housing societies, schools, retail shops, and warehouses to eliminate blind spots.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free blueprint camera layout</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-brand comparison quote</li>
            </ul>
            <div className="pt-2">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700">
                Request Survey <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      {featuredProducts.length > 0 && (
        <section className="bg-slate-100/70 py-20 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
                Genuine & Certified
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                Popular CCTV & Biometric Systems
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View Complete Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-card flex flex-col"
              >
                <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center p-4">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="object-contain h-full w-full hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-slate-400" />
                  )}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {prod.brand}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                      {prod.category.replace("_", " ")}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-2">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Price</span>
                      <span className="text-base font-black text-slate-900">
                        {prod.price ? `₹${Number(prod.price).toLocaleString("en-IN")}` : "Get Quote"}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/919308907319?text=Hi%20Yash%20Enterprises,%20I%20am%20interested%20in%20${encodeURIComponent(prod.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Why Choose Yash Enterprises Banner */}
      <section className="pt-14 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold uppercase tracking-wider">
                Why Customers Trust Us
              </span>
              <h3 className="text-2xl sm:text-4xl font-black">
                Authorized Dealers & Certified Engineers for Best CCTV Service
              </h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Unlike local unorganized mechanics, Yash Enterprises offers 100% tax invoices, original warranty cards, dedicated service ticket tracking, and guaranteed engineer visits within 4 business hours.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-black text-white">2,500+</div>
                  <div className="text-xs text-blue-200 mt-0.5">Cameras Installed</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">350+</div>
                  <div className="text-xs text-blue-200 mt-0.5">Active AMC Contracts</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">4.9 ★</div>
                  <div className="text-xs text-blue-200 mt-0.5">Customer Rating</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <a
                href="tel:+919308907319"
                className="w-full py-3.5 px-6 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-center text-sm shadow-lg transition"
              >
                Call +91 93089 07319
              </a>
              <Link
                href="/track"
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/40 text-white font-bold text-center text-sm transition"
              >
                Track Existing Ticket
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Continuous Loop Clients Marquee */}
      <ClientsMarquee />

      {/* The Yash Security Ecosystem Section (Right Above Footer) */}
      <ServiceAreas />
        <EcosystemSection />
    </>
  );
}
