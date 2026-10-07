import { getInvoices, getCollections } from "./actions";
import Link from "next/link";
import { Plus, Receipt, IndianRupee, FileText } from "lucide-react";
import FinanceItemActions from "./FinanceItemActions";

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  const invoices = await getInvoices();
  const collections = await getCollections();

  const quotationBills = [];
  const serviceBills = [];

  for (const inv of invoices) {
    let supplierRef = "";
    try {
      const notesObj = JSON.parse(inv.notes || "{}");
      supplierRef = notesObj.supplierRef || "";
    } catch(e) {}
    
    if (supplierRef.startsWith("TKT-")) {
      serviceBills.push(inv);
    } else {
      quotationBills.push(inv);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Finance & Billing</h1>
          <p className="text-slate-500 mt-1">Manage Invoices and Service Request Collections</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/finance/invoice/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Generate Bill
          </Link>
          <Link
            href="/admin/finance/collection/new"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <IndianRupee className="w-4 h-4" />
            Add Collection
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Quotation Bills */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[60vh]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Project/Retail Bills
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {quotationBills.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {quotationBills.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No bills generated yet.</div>
            ) : (
              quotationBills.map((inv) => {
                let meta = { invoiceDate: "" };
                try { meta = JSON.parse(inv.notes || "{}"); } catch(e) {}
                return (
                  <div key={inv.id} className="p-4 hover:bg-slate-50 transition flex justify-between items-start">
                    <div className="pr-2">
                      <div className="font-bold text-sm text-slate-800">{inv.quotationNo}</div>
                      <div className="text-xs font-medium text-slate-600 line-clamp-1">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{meta.invoiceDate || new Date(inv.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right flex flex-col items-end shrink-0">
                      <div className="font-bold text-sm text-emerald-600">₹{Number(inv.totalAmount).toLocaleString()}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Link 
                          href={`/admin/finance/invoice/${inv.id}`}
                          className="text-[10px] font-medium text-blue-600 hover:underline border border-blue-200 bg-blue-50 px-2 py-1 rounded"
                        >
                          View
                        </Link>
                      </div>
                      <FinanceItemActions id={inv.id} isInvoice={true} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Service Bills */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[60vh]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Service Bills
            </h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {serviceBills.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {serviceBills.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No service bills generated yet.</div>
            ) : (
              serviceBills.map((inv) => {
                let meta = { invoiceDate: "", supplierRef: "" };
                try { meta = JSON.parse(inv.notes || "{}"); } catch(e) {}
                return (
                  <div key={inv.id} className="p-4 hover:bg-slate-50 transition flex justify-between items-start">
                    <div className="pr-2">
                      <div className="font-bold text-sm text-slate-800">{inv.quotationNo}</div>
                      <div className="text-xs font-medium text-slate-600 line-clamp-1">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {meta.supplierRef && <span className="text-amber-600 font-semibold">{meta.supplierRef} | </span>}
                        {meta.invoiceDate || new Date(inv.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end shrink-0">
                      <div className="font-bold text-sm text-emerald-600">₹{Number(inv.totalAmount).toLocaleString()}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Link 
                          href={`/admin/finance/invoice/${inv.id}`}
                          className="text-[10px] font-medium text-blue-600 hover:underline border border-blue-200 bg-blue-50 px-2 py-1 rounded"
                        >
                          View
                        </Link>
                      </div>
                      <FinanceItemActions id={inv.id} isInvoice={true} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            Payment Collections
          </h2>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            {collections.length}
          </span>
        </div>
        <div className="divide-y divide-slate-100 overflow-y-auto max-h-[50vh]">
          {collections.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">No payment collections recorded yet. Click "Add Collection" to record a payment.</div>
          ) : (
            collections.map((col) => {
              let meta = { ticketNumber: "", collectionDate: "" };
              try { meta = JSON.parse(col.notes || "{}"); } catch(e) {}
              return (
                <div key={col.id} className="p-4 hover:bg-slate-50 transition flex justify-between items-start">
                  <div className="pr-2">
                    <div className="font-bold text-sm text-slate-800">{col.quotationNo}</div>
                    <div className="text-xs font-medium text-slate-600 line-clamp-1">{col.customerName}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {meta.ticketNumber && `TKT: ${meta.ticketNumber} | `}
                      {meta.collectionDate || new Date(col.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <div className="font-bold text-sm text-emerald-600">₹{Number(col.totalAmount).toLocaleString()}</div>
                    <div className="text-[10px] font-medium text-slate-500 mt-1">Collected</div>
                    <FinanceItemActions id={col.id} isInvoice={false} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
