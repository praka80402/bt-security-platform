import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

// GET /api/products (Public / Mobile App catalog with optional filter ?category=...&brand=...)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");

    const where: any = {};
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (featured === "true") where.featured = true;

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

// POST /api/products (Admin creates new product)
export async function POST(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { name, category, brand, modelNumber, price, description, features, imageUrl, inStock, featured } = body;

    if (!name || !category || !brand) {
      return NextResponse.json(
        { error: "Name, category, and brand are required" },
        { status: 400 }
      );
    }

    // Generate slug
    const baseSlug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const product = await db.product.create({
      data: {
        name: String(name).trim().slice(0, 150),
        slug,
        category,
        brand: String(brand).trim().slice(0, 50),
        modelNumber: modelNumber ? String(modelNumber).slice(0, 50) : null,
        price: price ? parseFloat(price) : null,
        description: description ? String(description).slice(0, 2000) : null,
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        imageUrl: imageUrl ? String(imageUrl).slice(0, 300) : null,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured !== undefined ? featured : false,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
