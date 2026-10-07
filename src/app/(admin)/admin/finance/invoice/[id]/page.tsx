import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PrintButton from "./PrintButton";

export const dynamic = 'force-dynamic';

export default async function InvoicePrintPage({ params }: { params: { id: string } }) {
  const invoice = await db.quotation.findUnique({
    where: { id: parseInt(params.id) },
    include: { items: true }
  });

  if (!invoice) return notFound();

  let meta = {
    invoiceDate: new Date(invoice.createdAt).toLocaleDateString("en-IN"),
    deliveryNote: "Cash",
    supplierRef: "",
    termsOfPayment: "Cash",
    isInvoice: false,
    ticketNumber: ""
  };
  try {
    meta = { ...meta, ...JSON.parse(invoice.notes || "{}") };
  } catch(e) {}

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      if (year && month && day) return `${day}/${month}/${year}`;
      return dateStr;
    } catch(e) { return dateStr; }
  };

  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

  const inWords = (nValue: number) => {
      let numStr = nValue.toString();
      if (numStr.length > 9) return 'overflow';
      let n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return; 
      let str = '';
      str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0] as any] + ' ' + a[n[1][1] as any]) + 'Crore ' : '';
      str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0] as any] + ' ' + a[n[2][1] as any]) + 'Lakh ' : '';
      str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0] as any] + ' ' + a[n[3][1] as any]) + 'Thousand ' : '';
      str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0] as any] + ' ' + a[n[4][1] as any]) + 'Hundred ' : '';
      str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0] as any] + ' ' + a[n[5][1] as any]) + 'Only ' : '';
      return str;
  }
  const amountInWords = (num: number) => {
      return inWords(num)?.toUpperCase() || "N/A";
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans pb-10 print:bg-white print:pb-0">
      <div className="max-w-4xl mx-auto pt-6 px-4 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/finance" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Finance
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto bg-white p-8 shadow-xl print:shadow-none print:p-0 border border-slate-200 print:border-none">
        
        {/* Top Header Section */}
        <div className="border-2 border-black flex flex-col md:flex-row">
          {/* Left Side: Company Details */}
          <div className="w-full md:w-1/2 p-3 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img src="/images/logo.png" alt="Company Logo" className="w-12 h-12 object-contain" />
                <h1 className="text-2xl font-bold text-red-600">YASH ENTERPRISES</h1>
              </div>
              <p className="text-sm font-bold">Address: - Plot No: -139, Lakhani bigha, Hanuman Asthan<br/>Near Sarvodya City:- Patna- 801105</p>
              <p className="text-sm font-bold mt-2">GSTIN/UIN:- <span className="font-bold">10BJMPP3497A1ZC</span></p>
              <p className="text-sm font-bold mt-2">State Name: Bihar, Code: 10 , India</p>
            </div>
            <p className="text-sm font-bold mt-4">E-Mail : - <a href="mailto:yashenterprises57575@gmail.com" className="text-blue-600 hover:underline">yashenterprises57575@gmail.com</a></p>
          </div>
          
          {/* Right Side: Invoice Meta */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex border-b-2 border-black">
              <div className="w-1/2 p-2 border-r-2 border-black">
                <span className="text-xs">Invoice No.</span>
                <div className="font-bold">{invoice.quotationNo}</div>
              </div>
              <div className="w-1/2 p-2">
                <span className="text-xs">Dated</span>
                <div className="font-bold">{formatDate(meta.invoiceDate)}</div>
              </div>
            </div>
            <div className="flex border-b-2 border-black">
              <div className="w-1/2 p-2 border-r-2 border-black">
                <span className="text-xs">Delivery Note</span>
                <div className="font-bold">{meta.deliveryNote || "Cash"}</div>
              </div>
              <div className="w-1/2 p-2">
                <span className="text-xs">Model/Terms of Payment</span>
                <div className="font-bold">{meta.termsOfPayment || "Cash"}</div>
              </div>
            </div>
            <div className="flex flex-1">
              <div className="w-1/2 p-2 border-r-2 border-black">
                <span className="text-xs">Supplier's Ref.</span>
                <div className="font-bold">{meta.supplierRef || ""}</div>
              </div>
              <div className="w-1/2 p-2">
                <span className="text-xs">Other Reference(s)</span>
                <div className="font-bold">{meta.ticketNumber || ""}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Section */}
        <div className="border-x-2 border-b-2 border-black p-3">
          <div className="flex items-start">
            <span className="text-red-600 font-bold w-36 whitespace-nowrap">BUYER NAME<span className="float-right mr-2">: -</span></span>
            <span className="font-bold">{invoice.customerName}</span>
          </div>
          <div className="flex items-start">
            <span className="text-red-600 font-bold w-36 whitespace-nowrap">BUYER ADDRESS<span className="float-right mr-2">: -</span></span>
            <span className="font-bold">{invoice.address}</span>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-x-2 border-b-2 border-black text-sm text-center">
          <thead>
            <tr className="border-b-2 border-black font-bold bg-white">
              <th className="p-2 border-r-2 border-black">SL No.</th>
              <th className="p-2 border-r-2 border-black">Description of Goods</th>
              <th className="p-2 border-r-2 border-black">HSN/SAC</th>
              <th className="p-2 border-r-2 border-black">Quantity</th>
              <th className="p-2 border-r-2 border-black">Rate</th>
              <th className="p-2 border-r-2 border-black">Warranty</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => {
              let itemMeta = { hsn: "", warranty: "Null" };
              try { itemMeta = { ...itemMeta, ...JSON.parse(item.description || "{}") }; } catch(e) {}
              
              return (
                <tr key={item.id} className="font-bold">
                  <td className="p-2 border-r-2 border-black">{idx + 1}.</td>
                  <td className="p-2 border-r-2 border-black text-left">{item.name}</td>
                  <td className="p-2 border-r-2 border-black">{itemMeta.hsn}</td>
                  <td className="p-2 border-r-2 border-black">{item.quantity.toString().padStart(2, '0')} Pc</td>
                  <td className="p-2 border-r-2 border-black">{Number(item.unitPrice).toFixed(2)} Rs</td>
                  <td className="p-2 border-r-2 border-black">{itemMeta.warranty || "Null"}</td>
                  <td className="p-2">{Number(item.totalPrice).toFixed(2)} Rs</td>
                </tr>
              );
            })}
            
            {/* Blank filler rows to make it look like a full page if needed (Optional) */}
            {Array.from({ length: Math.max(0, 8 - invoice.items.length) }).map((_, i) => (
              <tr key={`filler-${i}`}>
                <td className="p-4 border-r-2 border-black"></td>
                <td className="border-r-2 border-black"></td>
                <td className="border-r-2 border-black"></td>
                <td className="border-r-2 border-black"></td>
                <td className="border-r-2 border-black"></td>
                <td className="border-r-2 border-black"></td>
                <td></td>
              </tr>
            ))}
            
            {Number(invoice.taxAmount) > 0 ? (
              <>
                <tr className="border-t-2 border-black font-bold text-sm">
                  <td colSpan={4} className="border-r-2 border-black p-1"></td>
                  <td colSpan={2} className="border-r-2 border-black p-1 text-right">TAXABLE AMOUNT:</td>
                  <td className="p-1">{Number(invoice.subTotal).toFixed(2)} Rs</td>
                </tr>
                <tr className="border-t-2 border-black font-bold text-sm">
                  <td colSpan={4} className="border-r-2 border-black p-1"></td>
                  <td colSpan={2} className="border-r-2 border-black p-1 text-right">CGST @ 9%:</td>
                  <td className="p-1">{(Number(invoice.taxAmount) / 2).toFixed(2)} Rs</td>
                </tr>
                <tr className="border-t-2 border-black font-bold text-sm">
                  <td colSpan={4} className="border-r-2 border-black p-1"></td>
                  <td colSpan={2} className="border-r-2 border-black p-1 text-right">SGST @ 9%:</td>
                  <td className="p-1">{(Number(invoice.taxAmount) / 2).toFixed(2)} Rs</td>
                </tr>
                <tr className="border-t-2 border-black font-bold">
                  <td colSpan={4} className="border-r-2 border-black p-2"></td>
                  <td colSpan={2} className="border-r-2 border-black p-2 text-right">GRAND TOTAL: -</td>
                  <td className="p-2">{Number(invoice.totalAmount).toFixed(2)} Rs</td>
                </tr>
              </>
            ) : (
              <tr className="border-t-2 border-black font-bold">
                <td className="border-r-2 border-black p-2">.</td>
                <td colSpan={3} className="border-r-2 border-black p-2"></td>
                <td colSpan={2} className="border-r-2 border-black p-2 text-right">GRAND TOTAL: -</td>
                <td className="p-2">{Number(invoice.totalAmount).toFixed(2)} Rs</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Amount in words */}
        <div className="border-x-2 border-b-2 border-black p-2 text-center font-bold">
          INR - <span className="text-red-600">{amountInWords(Number(invoice.totalAmount))}</span> E. & O. E
        </div>

        {/* Declaration */}
        <div className="border-x-2 border-b-2 border-black p-2 text-center">
          <h3 className="font-bold underline text-base">Declaration</h3>
          <p className="font-bold text-sm mt-1">We declare that this invoice shows the actual price of goods described and that all particulars are true and correct</p>
        </div>

        {/* Bank & Terms */}
        <div className="border-x-2 border-b-2 border-black flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-3 border-b-2 md:border-b-0 md:border-r-2 border-black text-sm">
            <h3 className="text-red-600 font-bold text-center mb-2">Company's Bank Details</h3>
            <table className="font-bold text-xs w-full">
              <tbody>
                <tr>
                  <td className="w-32 py-0.5">Bank Name</td>
                  <td>: IDFC BANK</td>
                </tr>
                <tr>
                  <td className="py-0.5">Account Holder Name</td>
                  <td>:- YASH ENTERPRISES</td>
                </tr>
                <tr>
                  <td className="py-0.5">Account Number</td>
                  <td>:- 10089852947</td>
                </tr>
                <tr>
                  <td className="py-0.5">Branch</td>
                  <td>:- Boring Road ,Patna</td>
                </tr>
                <tr>
                  <td className="py-0.5">IFSC Code</td>
                  <td>:- IDFB0060281</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full md:w-1/2 p-3 text-sm">
            <h3 className="text-red-600 font-bold text-center underline mb-2">Terms &Conditions:</h3>
            <p className="font-bold leading-snug">Installation charges are non refundable</p>
            <p className="font-bold leading-snug">WARRANTY: - <span className="text-red-600">Warranty On products Provided By<br/>Company On their Service Center.</span></p>
            <p className="font-bold leading-snug">PRODUCTS:- Products once sold cannot be taken back</p>
            <p className="font-bold mt-3">ALL SUBJECT TO PATNA JURIDICTION ONLY</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="border-x-2 border-b-2 border-black flex">
          <div className="w-1/2 p-4 border-r-2 border-black flex items-end justify-center font-bold text-sm">
            Customer's Seal & Signature
          </div>
          <div className="w-1/2 p-4 text-center font-bold text-sm flex flex-col justify-between">
            <div className="mb-12">For Yash Enterprises</div>
            <div className="flex justify-between px-2">
              <span>Prepared by<br/>Signatory</span>
              <span>Verified by</span>
              <span>Authorized</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-sm font-medium print:mt-12">
          <p>SUBJECT TO PATNA JURISDICTION</p>
          <p>This is a Computer-Generated Invoice</p>
        </div>

      </div>
    </div>
  );
}
