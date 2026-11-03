import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/public/products/ProductDetailClient";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: "Product Not Found | Yash Enterprises",
    };
  }

  const priceStr = product.price ? `₹${Number(product.price).toLocaleString("en-IN")}` : "";
  const title = `${product.name} ${product.modelNumber ? `(${product.modelNumber})` : ""} - Best Price in Patna, Bihar | Yash Enterprises`;
  const description = `${product.name} ${priceStr ? `available at ${priceStr}` : ""}. 100% Genuine ${product.brand} surveillance equipment with official warranty, GST invoice & doorstep installation in Patna, Khagaul and Bihar.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.bestcctvservice.com/products/${product.slug}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
      type: "website",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  const rawRelated = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const serializedProduct = {
    ...product,
    mrp: product.mrp ? Number(product.mrp) : null,
    price: product.price ? Number(product.price) : null,
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
  };

  const serializedRelated = rawRelated.map((r) => ({
    ...r,
    mrp: r.mrp ? Number(r.mrp) : null,
    price: r.price ? Number(r.price) : null,
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
  }));

  // Schema.org Product Structured Data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl ? [product.imageUrl] : [],
    "description": product.description || product.name,
    "sku": product.modelNumber || `PROD-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand,
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.bestcctvservice.com/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price ? Number(product.price) : 0,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Yash Enterprises",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={serializedProduct}
        relatedProducts={serializedRelated}
      />
    </>
  );
}
