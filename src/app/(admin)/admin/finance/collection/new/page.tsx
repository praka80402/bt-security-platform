"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollection } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    collectionDate: new Date().toISOString().split("T")[0],
    amount: 0,
    ticketNumber: "",
    paymentMode: "Cash",
    description: "",
    source: "SALES", // SALES or SERVICE
    category: "CCTV" // CCTV, BIOMETRIC, FIRE, OTHER
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCollection(formData);
      router.push("/admin/finance");
    } catch (err) {
      console.error(err);
      alert("Error adding collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24">
      <div className="mb-6">
        <Link href="/admin/finance" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Finance
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Add Service Collection</h1>
        <p className="text-slate-500">Record payments received for service requests or AMC</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Customer / Company Name *</label>
          <input required type="text" className="w-full border rounded-lg p-2" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Income Source *</label>
            <select className="w-full border rounded-lg p-2 bg-white" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
              <option value="SALES">Sales / Project</option>
              <option value="SERVICE">Service / Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select className="w-full border rounded-lg p-2 bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="CCTV">CCTV</option>
              <option value="BIOMETRIC">Biometric</option>
              <option value="FIRE">Fire Alarm</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input type="text" className="w-full border rounded-lg p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input required type="date" className="w-full border rounded-lg p-2" value={formData.collectionDate} onChange={e => setFormData({...formData, collectionDate: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount Collected (₹) *</label>
            <input required type="number" min="1" className="w-full border rounded-lg p-2 font-bold text-emerald-600" value={formData.amount === 0 ? "" : formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)||0})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Mode</label>
            <select className="w-full border rounded-lg p-2" value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})}>
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer / NEFT</option>
              <option>Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Linked Ticket No. (Optional)</label>
          <input type="text" className="w-full border rounded-lg p-2" placeholder="e.g. TKT-1001" value={formData.ticketNumber} onChange={e => setFormData({...formData, ticketNumber: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description / Notes</label>
          <textarea className="w-full border rounded-lg p-2" rows={3} placeholder="Service details or remarks" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link href="/admin/finance" className="px-6 py-2 border rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</Link>
          <button disabled={loading} type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold disabled:opacity-50">
            {loading ? "Saving..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
