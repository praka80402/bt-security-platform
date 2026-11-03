import { db } from "@/lib/db";
import type { Metadata } from "next";
import ProductsStoreClient from "@/components/public/products/ProductsStoreClient";

export const metadata: Metadata = {
  title: "CCTV Cameras, Kits & Biometric Systems Store in Patna — CP Plus, Hikvision, eSSL",
  description:
    "Authorised CCTV & Biometrics store in Patna, Bihar. Buy 2MP, 4MP, 4K ColorVu IP cameras, DVRs, NVRs, CCTV combo kits, Seagate SkyHawk surveillance HDDs, and eSSL biometric attendance machines with 2 years warranty & doorstep installation.",
  keywords:
    "cctv store patna, buy cctv camera bihar, hikvision dealer patna, cp plus cctv price bihar, cctv combo kit, surveillance hard disk, essl biometric patna, best cctv service bihar",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "CCTV Cameras, Kits & Biometrics Store | Yash Enterprises Patna",
    description: "Authorised store for CP Plus, Hikvision, Dahua & eSSL in Bihar. 100% Genuine with Warranty.",
    url: "https://www.bestcctvservice.com/products",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    const rawProducts = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Serialize Decimals for Client Component
    products = rawProducts.map((p) => ({
      ...p,
      mrp: p.mrp ? Number(p.mrp) : null,
      price: p.price ? Number(p.price) : null,
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
    }));
  } catch (error) {
    console.error("Database query failed in ProductsPage:", error);
  }

  // Structured Data Schema for Google Merchant / Shopping
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Yash Enterprises Surveillance & Biometric Products Catalog",
    "itemListElement": products.slice(0, 15).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "image": p.imageUrl,
        "description": p.description,
        "sku": p.modelNumber || `SKU-${p.id}`,
        "brand": {
          "@type": "Brand",
          "name": p.brand,
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": p.price || 0,
          "availability": p.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "url": `https://www.bestcctvservice.com/products/${p.slug}`,
          "seller": {
            "@type": "Organization",
            "name": "Yash Enterprises",
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsStoreClient initialProducts={products} />
    </>
  );
}
