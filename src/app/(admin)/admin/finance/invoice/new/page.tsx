"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createInvoice, updateInvoice } from "../../actions";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationId = searchParams.get("quotationId");
  const editId = searchParams.get("editId");
  const ticketId = searchParams.get("ticketId");
  const targetId = editId || quotationId;
  const isTargetingTicket = !!ticketId;

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(!!targetId || isTargetingTicket);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    phone: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    deliveryNote: "Cash",
    supplierRef: "",
    termsOfPayment: "Cash"
  });

  const [items, setItems] = useState([
    { name: "", hsn: "", quantity: 1, unitPrice: 0, warranty: "01 Yr" }
  ]);
  const [applyGst, setApplyGst] = useState(true);

  useEffect(() => {
    if (targetId) {
      fetch(`/api/admin/quotations/${targetId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.quotation) {
            let meta = { invoiceDate: "", deliveryNote: "Cash", supplierRef: "", termsOfPayment: "Cash" };
            try { meta = { ...meta, ...JSON.parse(data.quotation.notes || "{}") }; } catch(e) {}
            
            setFormData(prev => ({
              ...prev,
              customerName: data.quotation.customerName || "",
              address: data.quotation.address || "",
              phone: data.quotation.phone || "",
              supplierRef: editId ? meta.supplierRef : data.quotation.quotationNo || "",
              invoiceDate: editId && meta.invoiceDate ? meta.invoiceDate : prev.invoiceDate,
              deliveryNote: editId ? meta.deliveryNote : prev.deliveryNote,
              termsOfPayment: editId ? meta.termsOfPayment : prev.termsOfPayment,
            }));

            if (editId) {
               setApplyGst(Number(data.quotation.taxAmount) > 0);
            }

            if (data.quotation.items && data.quotation.items.length > 0) {
              setItems(data.quotation.items.map((it: any) => {
                let itemMeta = { hsn: "", warranty: "01 Yr" };
                try { itemMeta = { ...itemMeta, ...JSON.parse(it.description || "{}") }; } catch(e) {}
                return {
                  name: it.name,
                  hsn: editId ? itemMeta.hsn : "",
                  quantity: it.quantity,
                  unitPrice: Number(it.unitPrice),
                  warranty: editId ? itemMeta.warranty : "01 Yr"
                };
              }));
            }
          }
          setInitLoading(false);
        });
    } else if (ticketId) {
      fetch(`/api/tickets/${ticketId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.ticket) {
            setFormData(prev => ({
              ...prev,
              customerName: data.ticket.customerName || "",
              address: data.ticket.address || "",
              phone: data.ticket.phone || "",
              supplierRef: `TKT-${data.ticket.id}`,
            }));
            
            let serviceDesc = "Service Charge";
            if (data.ticket.serviceType === "REPAIR") serviceDesc = `Repair Service (${data.ticket.issue})`;
            if (data.ticket.serviceType === "CCTV_INSTALL") serviceDesc = `CCTV Installation (${data.ticket.issue})`;
            if (data.ticket.serviceType === "BIOMETRIC_SETUP") serviceDesc = `Biometric Setup (${data.ticket.issue})`;
            if (data.ticket.serviceType === "AMC_VISIT") serviceDesc = `AMC Visit (${data.ticket.issue})`;

            setItems([
              { name: serviceDesc, hsn: "9987", quantity: 1, unitPrice: 0, warranty: "N/A" }
            ]);
          }
          setInitLoading(false);
        });
    }
  }, [targetId, editId, ticketId]);

  const grossTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxableAmount = applyGst ? grossTotal / 1.18 : grossTotal;
  const taxAmount = applyGst ? grossTotal - taxableAmount : 0;
  const grandTotal = grossTotal;

  if (initLoading) return <div className="flex h-96 items-center justify-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedItems = items.map(item => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice
      }));
      
      const payload = {
        ...formData,
        subTotal: taxableAmount,
        taxAmount,
        totalAmount: grandTotal,
        items: formattedItems
      };

      if (editId) {
        await updateInvoice(parseInt(editId), payload);
      } else {
        await createInvoice(payload);
      }
      router.push("/admin/finance");
    } catch (err) {
      console.error(err);
      alert("Error saving bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="mb-6">
        <Link href="/admin/finance" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Finance
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Generate New Bill</h1>
        <p className="text-slate-500">Create a finalized tax/retail invoice</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 border-b pb-2">Buyer Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Buyer Name *</label>
              <input required type="text" className="w-full border rounded-lg p-2" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Buyer Address *</label>
              <textarea required className="w-full border rounded-lg p-2" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
              <input type="text" className="w-full border rounded-lg p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 border-b pb-2">Invoice Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input required type="date" className="w-full border rounded-lg p-2" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Note</label>
              <input type="text" className="w-full border rounded-lg p-2" value={formData.deliveryNote} onChange={e => setFormData({...formData, deliveryNote: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Terms of Payment</label>
              <input type="text" className="w-full border rounded-lg p-2" value={formData.termsOfPayment} onChange={e => setFormData({...formData, termsOfPayment: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Supplier&apos;s Ref.</label>
              <input type="text" className="w-full border rounded-lg p-2" value={formData.supplierRef} onChange={e => setFormData({...formData, supplierRef: e.target.value})} />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">Line Items</h3>
            <button type="button" onClick={() => setItems([...items, { name: "", hsn: "", quantity: 1, unitPrice: 0, warranty: "01 Yr" }])} className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-2 font-medium">Description</th>
                  <th className="p-2 font-medium w-24">HSN/SAC</th>
                  <th className="p-2 font-medium w-20">Qty</th>
                  <th className="p-2 font-medium w-28">Rate (₹)</th>
                  <th className="p-2 font-medium w-24">Warranty</th>
                  <th className="p-2 font-medium w-28">Amount</th>
                  <th className="p-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="p-2">
                      <input required type="text" className="w-full border rounded p-1.5 text-sm" value={item.name} onChange={e => { const newI = [...items]; newI[idx].name = e.target.value; setItems(newI); }} placeholder="e.g. 04 CH DVR" />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full border rounded p-1.5 text-sm" value={item.hsn} onChange={e => { const newI = [...items]; newI[idx].hsn = e.target.value; setItems(newI); }} placeholder="850490" />
                    </td>
                    <td className="p-2">
                      <input required type="number" min="1" className="w-full border rounded p-1.5 text-sm" value={item.quantity} onChange={e => { const newI = [...items]; newI[idx].quantity = parseInt(e.target.value)||1; setItems(newI); }} />
                    </td>
                    <td className="p-2">
                      <input required type="number" min="0" className="w-full border rounded p-1.5 text-sm" value={item.unitPrice === 0 ? "" : item.unitPrice} onFocus={(e) => e.target.select()} onChange={e => { const newI = [...items]; newI[idx].unitPrice = parseFloat(e.target.value)||0; setItems(newI); }} />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full border rounded p-1.5 text-sm" value={item.warranty} onChange={e => { const newI = [...items]; newI[idx].warranty = e.target.value; setItems(newI); }} placeholder="02 Yrs" />
                    </td>
                    <td className="p-2 font-medium text-slate-700">
                      ₹{(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-start mt-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 bg-slate-50 border p-2 rounded-lg">
              <input type="checkbox" checked={applyGst} onChange={e => setApplyGst(e.target.checked)} className="w-4 h-4" />
              Apply 18% GST (CGST + SGST)
            </label>
            <div className="text-right space-y-1">
              {applyGst && (
                <>
                  <div className="text-sm font-semibold text-slate-600">Taxable Amount: ₹{taxableAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  <div className="text-sm font-semibold text-slate-500">CGST (9%): ₹{(taxAmount / 2).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  <div className="text-sm font-semibold text-slate-500">SGST (9%): ₹{(taxAmount / 2).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                </>
              )}
              <div className="text-xl font-bold text-slate-800 pt-2">
                Grand Total: ₹{grandTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link href="/admin/finance" className="px-6 py-2 border rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</Link>
          <button disabled={loading} type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-50">
            {loading ? "Generating..." : "Generate Bill"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewInvoicePage() { return <Suspense fallback={<div>Loading...</div>}><NewInvoiceForm /></Suspense>; }
