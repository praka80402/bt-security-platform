"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Send, Share2, Mail, Loader2, FileDown } from "lucide-react";
import { useParams } from "next/navigation";

export default function ViewQuotationPage() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/quotations/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuotation(data.quotation);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex h-96 items-center justify-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!quotation) return <div className="text-center text-rose-400 mt-20">Quotation not found!</div>;

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + document.getElementById("quotation-content")?.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${quotation.quotationNo}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleWhatsApp = () => {
    const text = `Hello ${quotation.customerName},%0A%0AHere is your quotation (${quotation.quotationNo}) from Yash Enterprises.%0ATotal Amount: Rs. ${quotation.totalAmount}%0A%0APlease let us know if you approve.%0A%0AThank You.`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Quotation ${quotation.quotationNo} - Yash Enterprises`);
    const body = encodeURIComponent(`Hello ${quotation.customerName},\n\nPlease find the details of your quotation below:\nTotal Amount: Rs. ${quotation.totalAmount}\n\nThank You,\nYash Enterprises`);
    window.location.href = `mailto:${quotation.email || ''}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/quotations" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{quotation.quotationNo}</h1>
            <p className="text-slate-400 text-xs">View & Share Quotation</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
            <Share2 className="w-4 h-4" /> WhatsApp
          </button>
          <button onClick={handleEmail} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition">
            <Mail className="w-4 h-4" /> Email
          </button>
          <button onClick={handlePrintPDF} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition">
            <FileText className="w-4 h-4" /> PDF / Print
          </button>
          <button onClick={handleDownloadWord} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
            <FileDown className="w-4 h-4" /> Word
          </button>
        </div>
      </div>

      {/* Printable Quotation Area */}
      <div id="quotation-content" className="bg-white text-slate-900 p-6 md:p-8 rounded-xl max-w-4xl mx-auto shadow-2xl print:shadow-none print:m-0 print:p-0 relative overflow-hidden">
        
        {/* Subtle Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none print:opacity-[0.05]">
          <img src="/images/logo.png" alt="watermark" className="w-[500px]" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4 mb-4 relative z-10">
          <div className="flex items-start gap-4">
            <img src="/images/logo.png" alt="Yash Enterprises Logo" className="w-20 h-auto object-contain mt-1" />
            <div>
              <h1 className="text-2xl font-black text-blue-700 tracking-tight">YASH ENTERPRISES</h1>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 mb-1.5">CCTV, Biometric & Fire Safety Solutions</p>
              <div className="text-[10px] text-slate-700 font-medium leading-snug max-w-sm space-y-0.5">
                <p>
                  <span className="font-bold text-slate-800">Address:</span> Plot No:-139, Lakhni bigha, Hanuman Asthan <br />
                  Near Sarvodya, City:- Patna- 801105
                </p>
                <p><span className="font-bold text-slate-800">State Name:</span> Bihar, Code: 10 , India</p>
                <p><span className="font-bold text-slate-800">GSTIN/UIN:</span> 10BJMPP3497A1ZC</p>
                <p><span className="font-bold text-slate-800">Email:</span> yash@bestcctvservice.com &nbsp;&nbsp;|&nbsp;&nbsp; <span className="font-bold text-slate-800">Phone:</span> +91 9308907319</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-col items-start">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest bg-blue-50 py-1 px-2 rounded-lg border border-blue-100 mb-2">
                Quotation
              </h2>
              <div className="space-y-1 px-2">
                <p className="text-xs font-bold text-slate-700 flex gap-2">
                  <span className="w-8">No:</span> <span className="text-blue-600">{quotation.quotationNo}</span>
                </p>
                <p className="text-xs font-bold text-slate-700 flex gap-2">
                  <span className="w-8">Date:</span> <span>{new Date(quotation.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 relative z-10">
          <div>
            <h3 className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-wider">Quotation For</h3>
            <p className="text-base font-bold text-slate-900 leading-tight">{quotation.customerName}</p>
            {quotation.companyName && <p className="text-xs font-bold text-slate-700">{quotation.companyName}</p>}
            <p className="text-xs text-slate-600 mt-1">Phone: <span className="font-medium">{quotation.phone}</span></p>
            {quotation.email && <p className="text-xs text-slate-600">Email: <span className="font-medium">{quotation.email}</span></p>}
          </div>
          <div className="text-right max-w-[250px]">
            <h3 className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-wider">Site / Billing Address</h3>
            <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap leading-tight">{quotation.address || "N/A"}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="min-h-[350px] relative z-10">
          <table className="w-full text-left border-collapse mb-4">
            <thead>
              <tr className="bg-blue-600 text-white rounded-t-lg">
                <th className="py-2 px-3 text-xs font-bold w-12 rounded-tl-lg">S.No</th>
                <th className="py-2 px-3 text-xs font-bold">Item & Description</th>
                <th className="py-2 px-3 text-xs font-bold text-center w-16">Qty</th>
                <th className="py-2 px-3 text-xs font-bold text-right w-24">Unit Price</th>
                <th className="py-2 px-3 text-xs font-bold text-right w-28 rounded-tr-lg">Total</th>
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

        {/* Footer Grid: Bank Details & Totals */}
        <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
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
              {quotation.discount > 0 && (
                <div className="flex justify-between text-xs font-bold text-rose-500 px-2">
                  <span>Discount:</span>
                  <span>- Rs. {quotation.discount.toLocaleString()}</span>
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
