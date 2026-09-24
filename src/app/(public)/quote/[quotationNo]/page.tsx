import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Shield, Printer } from "lucide-react";
import { getAuthUserServer } from "@/lib/auth";
import crypto from "crypto";

export async function generateMetadata({
  params,
}: {
  params: { quotationNo: string };
}): Promise<Metadata> {
  const quotationNo = params.quotationNo.toUpperCase();
  const quotation = await db.quotation.findUnique({
    where: { quotationNo },
  });

  if (!quotation) {
    return { title: "Quotation Not Found" };
  }

  const typeMap: Record<string, string> = {
    CCTV: "CCTV Setup",
    BIOMETRIC: "Biometric Setup",
    FIRE: "Fire Alarm Setup",
    OTHER: "Security Setup",
  };
  
  const typeStr = typeMap[quotation.type] || quotation.type;
  const cName = quotation.companyName ? `${quotation.companyName} - ` : (quotation.customerName ? `${quotation.customerName} - ` : "");
  
  return {
    title: `${cName}${typeStr} Quotation`,
  };
}

export default async function PublicQuotationPage({
  params,
  searchParams,
}: {
  params: { quotationNo: string };
  searchParams: { k?: string };
}) {
  const quotationNo = params.quotationNo.toUpperCase();
  
  const quotation = await db.quotation.findUnique({
    where: { quotationNo },
    include: { items: true },
  });

  const user = await getAuthUserServer();
  let tokenOk = false;

  if (quotation?.publicToken && searchParams.k) {
    try {
      const dbToken = Buffer.from(quotation.publicToken);
      const queryToken = Buffer.from(searchParams.k.padEnd(quotation.publicToken.length).slice(0, quotation.publicToken.length));
      tokenOk = crypto.timingSafeEqual(dbToken, queryToken);
    } catch (e) {
      tokenOk = false;
    }
  }

  if (!quotation || (!user && !tokenOk)) {
    notFound();
  }

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 font-sans print:bg-white print:p-0 print:py-0">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl shadow-lg">
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold text-white">{quotation.quotationNo}</h1>
          <p className="text-slate-400 text-xs">Official Quotation from Yash Enterprises</p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition shadow-md w-full sm:w-auto"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Quotation Area */}
      <div id="quotation-content" className="bg-white text-slate-900 p-6 md:p-8 rounded-xl max-w-4xl mx-auto shadow-2xl print:shadow-none print:m-0 print:p-0 relative overflow-hidden">
        
        {/* Faded Background Watermark Logo */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Shield className="w-96 h-96" />
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b-2 border-slate-100 pb-4 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-2 shrink-0">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                YASH ENTERPRISES
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                {process.env.NEXT_PUBLIC_BRAND_TAGLINE || "Best CCTV Service & Biometric Solutions"}
              </p>
              <div className="mt-2 space-y-0.5 text-xs font-medium text-slate-600 leading-tight max-w-[320px]">
                <p>Plot No:-139, Lakhni bigha, Hanuman Asthan Near Sarvodya, City:- Patna- 801105</p>
                <p>State: Bihar, Code: 10 , India</p>
                <p className="font-bold text-slate-800 flex flex-wrap items-center gap-2 mt-1">
                  <span>Phone: {process.env.NEXT_PUBLIC_PHONE}</span>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span>GSTIN: 10BJMPP3497A1ZC</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex flex-col items-start w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-widest bg-blue-50 py-1 px-2 rounded-lg border border-blue-100 mb-2 w-full sm:w-auto text-center sm:text-left">
                Quotation
              </h2>
              <div className="space-y-1 px-2 w-full">
                <p className="text-xs font-bold text-slate-700 flex gap-2 justify-between sm:justify-start">
                  <span className="w-8">No:</span> <span className="text-blue-600">{quotation.quotationNo}</span>
                </p>
                <p className="text-xs font-bold text-slate-700 flex gap-2 justify-between sm:justify-start">
                  <span className="w-8">Date:</span> <span>{new Date(quotation.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 relative z-10 gap-3">
          <div>
            <h3 className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-wider">Quotation For</h3>
            <p className="text-base font-bold text-slate-900 leading-tight">{quotation.customerName}</p>
            {quotation.companyName && <p className="text-xs font-bold text-slate-700">{quotation.companyName}</p>}
            <p className="text-xs text-slate-600 mt-1">Phone: <span className="font-medium">{quotation.phone}</span></p>
            {quotation.email && <p className="text-xs text-slate-600">Email: <span className="font-medium">{quotation.email}</span></p>}
          </div>
          <div className="text-left sm:text-right sm:max-w-[250px] border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 mt-1 sm:mt-0">
            <h3 className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-wider">Site / Billing Address</h3>
            <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap leading-tight">{quotation.address || "N/A"}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="min-h-[250px] sm:min-h-[350px] relative z-10">
          <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
            <table className="w-full text-left border-collapse mb-4 min-w-[500px]">
              <thead>
                <tr className="bg-blue-600 text-white rounded-t-lg">
                  <th className="py-2 px-3 text-xs font-bold w-10 sm:w-12 rounded-tl-lg">S.No</th>
                  <th className="py-2 px-3 text-xs font-bold">Item & Description</th>
                  <th className="py-2 px-3 text-xs font-bold text-center w-12 sm:w-16">Qty</th>
                  <th className="py-2 px-3 text-xs font-bold text-right w-20 sm:w-24">Unit Price</th>
                  <th className="py-2 px-3 text-xs font-bold text-right w-24 sm:w-28 rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item: any, index: number) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="py-1.5 px-3 text-xs font-bold text-slate-500 align-top">{index + 1}</td>
                    <td className="py-1.5 px-3 align-top">
                      <div className="font-bold text-sm text-slate-800 leading-tight">{item.name}</div>
                      {item.description && <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.description}</div>}
                    </td>
                    <td className="py-1.5 px-3 text-xs text-center font-bold text-slate-700 align-top">{item.quantity}</td>
                    <td className="py-1.5 px-3 text-xs text-right font-medium text-slate-700 align-top">Rs. {item.unitPrice.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-xs text-right font-black text-slate-900 align-top">Rs. {item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Grid: Bank Details & Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative z-10">
          {/* Bank Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <h4 className="text-[11px] font-black uppercase text-blue-600 mb-2 tracking-wider flex items-center gap-1">
              Account Details
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-slate-500 font-medium">Bank Name:</span>
                <span className="font-bold text-slate-800">IDFC BANK</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-slate-500 font-medium">Account Name:</span>
                <span className="font-bold text-slate-800">YASH ENTERPRISES</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-slate-500 font-medium">Account Number:</span>
                <span className="font-bold text-slate-800">10089852947</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-slate-500 font-medium">Branch:</span>
                <span className="font-bold text-slate-800">Boring Road, Patna</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-slate-500 font-medium">IFSC Code:</span>
                <span className="font-bold text-slate-800">IDFB0060281</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="flex flex-col justify-end p-2">
            <div className="space-y-1.5 w-full max-w-xs ml-auto">
              <div className="flex justify-between text-xs font-bold text-slate-600 px-2">
                <span>Subtotal:</span>
                <span>Rs. {quotation.subTotal.toLocaleString()}</span>
              </div>
              {Number(quotation.discount ?? 0) > 0 && (
                <div className="flex justify-between text-xs font-bold text-rose-500 px-2">
                  <span>Discount:</span>
                  <span>- Rs. {Number(quotation.discount ?? 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-blue-700 bg-blue-50 border border-blue-100 py-2 px-3 rounded-lg mt-2 shadow-sm">
                <span>Grand Total:</span>
                <span>Rs. {quotation.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="text-[10px] text-slate-600 border-t-2 border-slate-100 pt-3 relative z-10 flex justify-between items-end">
          <div>
            <h4 className="font-black text-slate-800 uppercase mb-1">Terms & Conditions</h4>
            <ol className="list-decimal pl-3 space-y-0.5 font-medium">
              <li>Validity of quotation is 15 days from the date of issue.</li>
              <li>100% Payment is required upon successful installation/delivery.</li>
              <li>Warranty as per OEM terms and conditions. Physical damage/burns are not covered.</li>
              <li>Any extra wiring or civil work will be charged at actuals.</li>
            </ol>
          </div>
          <div className="text-center w-40">
            <div className="h-12 border-b border-slate-300 mb-1"></div>
            <p className="font-bold text-slate-800">Authorized Signatory</p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #quotation-content, #quotation-content * { visibility: visible; }
          #quotation-content { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: none !important; }
          .print\\:hidden { display: none !important; }
          @page { size: A4 portrait; margin: 0.5cm; }
        }
      `}} />
    </div>
  );
}

