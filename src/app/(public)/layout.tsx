import "./public.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { CallModalProvider } from "@/context/CallModalContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Yash Enterprises",
    "image": "https://bestcctvservice.com/images/logo.png",
    "url": "https://bestcctvservice.com",
    "telephone": "+919308907319",
    "email": "yash@bestcctvservice.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No:-139, Lakhni bigha, Hanuman Asthan Near Sarvodya",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "postalCode": "801105",
      "addressCountry": "IN"
    },
    "areaServed": [
      "Patna", "Ara", "Buxar", "Hajipur", "Chapra", 
      "Muzaffarpur", "Masaurhi", "Gaya", "Barh", "Bakhtiarpur"
    ],
    "priceRange": "$$",
    "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 09:00-20:00",
    "description": "Top CCTV installation, biometric attendance, and AMC maintenance in Patna and across Bihar."
  };

  return (
    <CallModalProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">`n        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:font-bold focus:shadow-xl">Skip to content</a>
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </CallModalProvider>
  );
}
