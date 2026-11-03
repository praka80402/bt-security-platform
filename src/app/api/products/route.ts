import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

// GET /api/products (Public / Admin catalog with filters ?category=...&brand=...&subCategory=...)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: any = {};
    if (category) where.category = category;
    if (subCategory) where.subCategory = subCategory;
    if (brand) where.brand = brand;
    if (featured === "true") where.featured = true;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { modelNumber: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products (Admin creates new product with category-wise fields)
export async function POST(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const {
      name,
      category,
      subCategory,
      brand,
      modelNumber,
      mrp,
      price,
      discountPercent,
      description,
      features,
      specs,
      imageUrl,
      galleryImages,
      warranty,
      hsnCode,
      isKit,
      kitConfig,
      inStock,
      featured,
    } = body;

    if (!name || !category || !brand) {
      return NextResponse.json(
        { error: "Name, category, and brand are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const parsedMrp = mrp ? parseFloat(mrp) : null;
    const parsedPrice = price ? parseFloat(price) : null;
    
    // Auto calculate discount percent if not provided
    let calculatedDiscount = discountPercent ? parseInt(discountPercent, 10) : 0;
    if (!calculatedDiscount && parsedMrp && parsedPrice && parsedMrp > parsedPrice) {
      calculatedDiscount = Math.round(((parsedMrp - parsedPrice) / parsedMrp) * 100);
    }

    const product = await db.product.create({
      data: {
        name: String(name).trim().slice(0, 150),
        slug,
        category,
        subCategory: subCategory ? String(subCategory).trim() : null,
        brand: String(brand).trim().slice(0, 50),
        modelNumber: modelNumber ? String(modelNumber).slice(0, 50) : null,
        mrp: parsedMrp,
        price: parsedPrice,
        discountPercent: calculatedDiscount,
        description: description ? String(description).slice(0, 3000) : null,
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        specs: typeof specs === "string" ? specs : JSON.stringify(specs || {}),
        imageUrl: imageUrl ? String(imageUrl).slice(0, 500) : null,
        galleryImages: typeof galleryImages === "string" ? galleryImages : JSON.stringify(galleryImages || []),
        warranty: warranty ? String(warranty).slice(0, 100) : "2 Years Brand Warranty",
        hsnCode: hsnCode ? String(hsnCode).slice(0, 20) : null,
        isKit: Boolean(isKit),
        kitConfig: typeof kitConfig === "string" ? kitConfig : (kitConfig ? JSON.stringify(kitConfig) : null),
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        featured: featured !== undefined ? Boolean(featured) : false,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
