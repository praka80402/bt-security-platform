"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getInvoices() {
  return await db.quotation.findMany({
    where: {
      quotationNo: { startsWith: "YE/" }
    },
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });
}

export async function getCollections() {
  return await db.quotation.findMany({
    where: {
      quotationNo: { startsWith: "REC/" }
    },
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });
}

export async function createInvoice(data: any) {
  // Generate YE/26-27/XX invoice number
  let nextNum = 1;
  const lastInvoice = await db.quotation.findFirst({
    where: { quotationNo: { startsWith: "YE/" } },
    orderBy: { id: "desc" },
    select: { quotationNo: true }
  });
  
  if (lastInvoice) {
    const parts = lastInvoice.quotationNo.split("/");
    const lastVal = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastVal)) nextNum = lastVal + 1;
  }
  
  const newNumber = `YE/26-27/${nextNum.toString().padStart(3, "0")}`;

  const notesJson = JSON.stringify({
    isInvoice: true,
    invoiceDate: data.invoiceDate,
    deliveryNote: data.deliveryNote || "Cash",
    supplierRef: data.supplierRef || "",
    termsOfPayment: data.termsOfPayment || "Cash"
  });

  const publicToken = crypto.randomBytes(16).toString("hex");

  const invoice = await db.quotation.create({
    data: {
      quotationNo: newNumber,
      publicToken,
      type: "OTHER",
      status: "ACCEPTED", // Mark as final
      customerName: data.customerName,
      address: data.address,
      phone: data.phone || "N/A",
      subTotal: data.subTotal,
      taxAmount: data.taxAmount || 0,
      totalAmount: data.totalAmount,
      notes: notesJson,
      items: {
        create: data.items.map((item: any) => ({
          name: item.name,
          description: JSON.stringify({
            hsn: item.hsn,
            warranty: item.warranty
          }),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      }
    }
  });

  revalidatePath("/admin/finance");
  return invoice;
}

export async function createCollection(data: any) {
  let nextNum = 1;
  const lastCollection = await db.quotation.findFirst({
    where: { quotationNo: { startsWith: "REC/" } },
    orderBy: { id: "desc" },
    select: { quotationNo: true }
  });
  
  if (lastCollection) {
    const parts = lastCollection.quotationNo.split("/");
    const lastVal = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastVal)) nextNum = lastVal + 1;
  }
  
  const newNumber = `REC/${nextNum.toString().padStart(4, "0")}`;

  const notesJson = JSON.stringify({
    isCollection: true,
    collectionDate: data.collectionDate,
    ticketNumber: data.ticketNumber || "",
    paymentMode: data.paymentMode || "Cash",
    source: data.source || "SALES",
    category: data.category || "CCTV"
  });

  const publicToken = crypto.randomBytes(16).toString("hex");

  const collection = await db.quotation.create({
    data: {
      quotationNo: newNumber,
      publicToken,
      type: "OTHER",
      status: "ACCEPTED",
      customerName: data.customerName,
      phone: data.phone || "N/A",
      address: data.address || "",
      subTotal: data.amount,
      totalAmount: data.amount,
      notes: notesJson,
      items: {
        create: [{
          name: "Service Request Collection",
          description: data.description || "Payment received for service",
          quantity: 1,
          unitPrice: data.amount,
          totalPrice: data.amount
        }]
      }
    }
  });

  revalidatePath("/admin/finance");
  return collection;
}

export async function updateInvoice(id: number, data: any) {
  await db.quotationItem.deleteMany({ where: { quotationId: id } });

  const notesJson = JSON.stringify({
    isInvoice: true,
    invoiceDate: data.invoiceDate,
    deliveryNote: data.deliveryNote || "Cash",
    supplierRef: data.supplierRef || "",
    termsOfPayment: data.termsOfPayment || "Cash"
  });

  await db.quotation.update({
    where: { id },
    data: {
      customerName: data.customerName,
      address: data.address,
      phone: data.phone || "N/A",
      subTotal: data.subTotal,
      taxAmount: data.taxAmount || 0,
      totalAmount: data.totalAmount,
      notes: notesJson,
      items: {
        create: data.items.map((item: any) => ({
          name: item.name,
          description: JSON.stringify({
            hsn: item.hsn,
            warranty: item.warranty
          }),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      }
    }
  });

  revalidatePath("/admin/finance");
}

export async function deleteFinanceRecord(id: number) {
  await db.quotation.delete({ where: { id } });
  revalidatePath("/admin/finance");
}
