import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CCTV Storage & HDD Calculator | Yash Enterprises",
  description: "Free advanced CCTV Storage and Bandwidth calculator. Accurately estimate required Hard Disk Space (TB/GB) based on cameras, resolution, FPS, and H.265/H.265+ compression.",
  keywords: "CCTV Storage Calculator, HDD Calculator, CCTV Bandwidth Calculator, IP Camera Storage, H.265 Storage Calculator, Security Camera Storage",
  alternates: {
    canonical: "https://www.bestcctvservice.com/calculator",
  },
  openGraph: {
    title: "CCTV Storage & HDD Calculator | Yash Enterprises",
    description: "Accurately estimate required Hard Disk Space (TB/GB) based on cameras, resolution, FPS, and compression.",
    url: "https://www.bestcctvservice.com/calculator",
    type: "website",
  }
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Advanced CCTV Storage & HDD Calculator",
    "url": "https://www.bestcctvservice.com/calculator",
    "description": "Calculate exact Hard Disk Drive (HDD) space and network bandwidth required for your CCTV setup. Supports IP and Analog cameras, H.264/H.265 encoding, and motion-based recording estimation.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Yash Enterprises",
      "url": "https://www.bestcctvservice.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      {/* JSON-LD for Calculator SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
