import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireStaff } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isNum = !isNaN(parseInt(params.id, 10));
    const product = isNum
      ? await db.product.findUnique({ where: { id: parseInt(params.id, 10) } })
      : await db.product.findUnique({ where: { slug: params.id } });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const id = parseInt(params.id, 10);
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

    const parsedMrp = mrp !== undefined ? (mrp ? parseFloat(mrp) : null) : undefined;
    const parsedPrice = price !== undefined ? (price ? parseFloat(price) : null) : undefined;

    let calculatedDiscount = discountPercent !== undefined ? parseInt(discountPercent, 10) : undefined;
    if (calculatedDiscount === undefined && parsedMrp && parsedPrice && parsedMrp > parsedPrice) {
      calculatedDiscount = Math.round(((parsedMrp - parsedPrice) / parsedMrp) * 100);
    }

    const updated = await db.product.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(category && { category }),
        ...(subCategory !== undefined && { subCategory }),
        ...(brand && { brand: String(brand).trim() }),
        ...(modelNumber !== undefined && { modelNumber }),
        ...(parsedMrp !== undefined && { mrp: parsedMrp }),
        ...(parsedPrice !== undefined && { price: parsedPrice }),
        ...(calculatedDiscount !== undefined && { discountPercent: calculatedDiscount }),
        ...(description !== undefined && { description }),
        ...(features !== undefined && { features: typeof features === "string" ? features : JSON.stringify(features) }),
        ...(specs !== undefined && { specs: typeof specs === "string" ? specs : JSON.stringify(specs) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(galleryImages !== undefined && { galleryImages: typeof galleryImages === "string" ? galleryImages : JSON.stringify(galleryImages) }),
        ...(warranty !== undefined && { warranty }),
        ...(hsnCode !== undefined && { hsnCode }),
        ...(isKit !== undefined && { isKit: Boolean(isKit) }),
        ...(kitConfig !== undefined && { kitConfig: typeof kitConfig === "string" ? kitConfig : (kitConfig ? JSON.stringify(kitConfig) : null) }),
        ...(inStock !== undefined && { inStock: Boolean(inStock) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const id = parseInt(params.id, 10);
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
