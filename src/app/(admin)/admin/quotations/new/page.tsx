"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Camera, Wifi, Sun, Server, Loader2 } from "lucide-react";

export default function CreateQuotationPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [type, setType] = useState("CCTV");
  const [cctvType, setCctvType] = useState("HD");
  
  // Client Details
  const [clientInfo, setClientInfo] = useState({
    name: "", company: "", phone: "", email: "", address: ""
  });

  // Items State
  const [items, setItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);

  // Load CCTV Templates... (rest of the functions remain the same)
  const loadCCTVTemplate = (cameraType: string) => {
    if (cameraType === "HD") {
      setItems([
        { id: 1, name: "DVR", description: "4 Channel 2.4MP", qty: 1, price: 0, options: ["4 Channel 2.4MP", "4 Channel 5MP", "8 Channel 2.4MP", "8 Channel 5MP", "16 Channel 2.4MP", "16 Channel 5MP"] },
        { id: 2, name: "HD Dome Camera", description: "2.4MP Basic", qty: 2, price: 0, options: ["2.4MP Basic", "2.4MP with Audio", "2.4MP Color+Audio", "5MP Basic", "5MP with Audio", "5MP Color+Audio"] },
        { id: 3, name: "HD Bullet Camera", description: "2.4MP Basic", qty: 2, price: 0, options: ["2.4MP Basic", "2.4MP with Audio", "2.4MP Color+Audio", "5MP Basic", "5MP with Audio", "5MP Color+Audio"] },
        { id: 4, name: "Hard Disk", description: "1TB Surveillance", qty: 1, price: 0, options: ["500GB Surveillance", "1TB Surveillance", "2TB Surveillance", "4TB Surveillance", "8TB Surveillance"] },
        { id: 5, name: "Power Supply", description: "4 CH SMPS", qty: 1, price: 0, options: ["4 CH SMPS", "8 CH SMPS", "16 CH SMPS"] },
        { id: 6, name: "Wire Roll (3+1 CCTV Cable)", description: "Per Bundle (90m)", qty: 1, price: 0, options: null },
        { id: 7, name: "BNC & DC Connector Set", description: "1 Set (2 BNC, 1 DC)", qty: 4, price: 0, options: null },
        { id: 8, name: "Installation Charges", description: "Per camera labor", qty: 4, price: 0, options: null },
      ]);
    } else if (cameraType === "IP") {
      setItems([
        { id: 1, name: "NVR", description: "4 Channel", qty: 1, price: 0, options: ["4 Channel", "8 Channel", "16 Channel", "32 Channel", "64 Channel"] },
        { id: 2, name: "IP Dome Camera", description: "2MP IP Basic", qty: 2, price: 0, options: ["2MP IP Basic", "2MP IP with Audio", "2MP IP Color+Audio", "5MP IP Basic", "5MP IP with Audio", "5MP IP Color+Audio"] },
        { id: 3, name: "IP Bullet Camera", description: "2MP IP Basic", qty: 2, price: 0, options: ["2MP IP Basic", "2MP IP with Audio", "2MP IP Color+Audio", "5MP IP Basic", "5MP IP with Audio", "5MP IP Color+Audio"] },
        { id: 4, name: "Hard Disk", description: "1TB Surveillance", qty: 1, price: 0, options: ["1TB Surveillance", "2TB Surveillance", "4TB Surveillance", "8TB Surveillance"] },
        { id: 5, name: "POE Switch", description: "4 Port POE", qty: 1, price: 0, options: ["4 Port POE", "8 Port POE", "16 Port POE", "24 Port POE"] },
        { id: 6, name: "Wire Roll (CAT6 Cable)", description: "Per Bundle (90m) / Box (305m)", qty: 1, price: 0, options: ["Bundle (90m)", "Box (305m)"] },
        { id: 7, name: "RJ45 Connectors", description: "Per Piece", qty: 8, price: 0, options: null },
        { id: 8, name: "Installation Charges", description: "Per camera labor", qty: 4, price: 0, options: null },
      ]);
    } else if (cameraType === "WIFI") {
      setItems([
        { id: 1, name: "Wi-Fi Camera", description: "Indoor PTZ", qty: 1, price: 0, options: ["Indoor PTZ", "Outdoor Bullet", "Outdoor PTZ Dual Lens"] },
        { id: 2, name: "MicroSD Memory Card", description: "64GB", qty: 1, price: 0, options: ["32GB", "64GB", "128GB", "256GB"] },
        { id: 3, name: "Installation Charges", description: "Setup & Config", qty: 1, price: 0, options: null },
      ]);
    } else if (cameraType === "SOLAR") {
      setItems([
        { id: 1, name: "4G Solar Camera", description: "PTZ with Solar Panel", qty: 1, price: 0, options: ["PTZ with Solar Panel", "Fixed Bullet Solar"] },
        { id: 2, name: "MicroSD Memory Card", description: "128GB", qty: 1, price: 0, options: ["64GB", "128GB", "256GB"] },
        { id: 3, name: "Pole Mount Bracket", description: "Heavy Duty", qty: 1, price: 0, options: null },
        { id: 4, name: "Installation Charges", description: "Labor & Config", qty: 1, price: 0, options: null },
      ]);
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (newType === "CCTV") {
      loadCCTVTemplate(cctvType);
    } else if (newType === "BIOMETRIC") {
      setItems([
        { id: 1, name: "Attendance Machine", description: "Fingerprint + Face", qty: 1, price: 0, options: null },
        { id: 2, name: "EM Lock", description: "Magnetic Door Lock", qty: 1, price: 0, options: null },
        { id: 3, name: "Exit Switch", description: "Push to exit button", qty: 1, price: 0, options: null },
        { id: 4, name: "Installation & Training", description: "Setup and config", qty: 1, price: 0, options: null },
      ]);
    } else if (newType === "FIRE") {
      setItems([
        { id: 1, name: "Fire Extinguisher ABC", description: "4 KG", qty: 1, price: 0, options: ["2 KG", "4 KG", "6 KG", "9 KG"] },
        { id: 2, name: "Fire Extinguisher CO2", description: "2 KG", qty: 1, price: 0, options: ["2 KG", "4.5 KG", "6.5 KG"] },
        { id: 3, name: "Refilling Charges", description: "", qty: 1, price: 0, options: null },
      ]);
    } else {
      setItems([{ id: 1, name: "", description: "", qty: 1, price: 0, options: null }]);
    }
  };

  useEffect(() => {
    loadCCTVTemplate("HD");
  }, []);

  const handleCCTVTypeChange = (newCctvType: string) => {
    setCctvType(newCctvType);
    loadCCTVTemplate(newCctvType);
  };

  const addItem = () => setItems([...items, { id: Date.now(), name: "", description: "", qty: 1, price: 0, options: null }]);
  const removeItem = (id: number) => setItems(items.filter(item => item.id !== id));
  const updateItem = (id: number, field: string, value: any) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));

  const handleAddOptional = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    
    let newItem = { id: Date.now(), name: "", description: "", qty: 1, price: 0, options: null as any };
    
    if (val === "MONITOR") newItem = { ...newItem, name: "Monitor / LED Display", description: "19 inch", options: ["19 inch", "24 inch", "32 inch"] };
    if (val === "RACK") newItem = { ...newItem, name: "Equipment Rack", description: "2U DVR Rack", options: ["2U DVR Rack", "4U Network Rack"] };
    if (val === "BOX") newItem = { ...newItem, name: "Camera Box", description: "PVC Weatherproof Box", qty: 4 };
    if (val === "HDMI") newItem = { ...newItem, name: "HDMI Cable", description: "1.5 Meter", options: ["1.5 Meter", "3 Meter", "5 Meter", "10 Meter"] };
    if (val === "MOUSE") newItem = { ...newItem, name: "Wireless Mouse", description: "2.4GHz Wireless Mouse" };
    if (val === "USB") newItem = { ...newItem, name: "USB Extension Cable", description: "3 Meter", options: ["3 Meter", "5 Meter", "10 Meter"] };
    if (val === "ROUTER") newItem = { ...newItem, name: "4G Router / Dongle", description: "For Internet Access" };

    setItems([...items, newItem]);
    e.target.value = "";
  };

  const subTotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const totalAmount = subTotal - discount;

  const handleSave = async () => {
    if (!clientInfo.name || !clientInfo.phone) {
      alert("Please enter Client Name and Phone Number.");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          customerName: clientInfo.name,
          companyName: clientInfo.company,
          phone: clientInfo.phone,
          email: clientInfo.email,
          address: clientInfo.address,
          subTotal,
          discount,
          taxAmount: 0,
          totalAmount,
          items: items.filter(i => i.name && i.price >= 0) // only save valid items
        })
      });
      
      if (response.ok) {
        router.push('/admin/quotations');
      } else {
        alert("Failed to save quotation.");
      }
    } catch (error) {
      alert("Error saving quotation.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Tabs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Quotations Management</h1>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Quotation"}
          </button>
        </div>
        <div className="flex border-b border-slate-800">
          <div className="px-6 py-3 text-sm font-bold text-blue-400 border-b-2 border-blue-500">
            Create Quotation
          </div>
          <Link 
            href="/admin/quotations" 
            className="px-6 py-3 text-sm font-semibold text-slate-400 hover:text-white transition border-b-2 border-transparent hover:border-slate-600"
          >
            Saved Quotations
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Left Column (Settings & Client) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Category Type */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">1. Service Type</h3>
            <select 
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="CCTV">CCTV Setup</option>
              <option value="BIOMETRIC">Biometric / Access Control</option>
              <option value="FIRE">Fire Extinguisher</option>
              <option value="OTHER">Custom / Others</option>
            </select>

            {/* CCTV Technology Toggles */}
            {type === "CCTV" && (
              <div className="pt-3 space-y-2 border-t border-slate-800">
                <label className="text-xs text-slate-500 uppercase font-semibold">Camera Technology</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleCCTVTypeChange("HD")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition ${cctvType === "HD" ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Camera className="w-3 h-3" /> HD Camera
                  </button>
                  <button 
                    onClick={() => handleCCTVTypeChange("IP")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition ${cctvType === "IP" ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Server className="w-3 h-3" /> IP Camera
                  </button>
                  <button 
                    onClick={() => handleCCTVTypeChange("WIFI")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition ${cctvType === "WIFI" ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Wifi className="w-3 h-3" /> Wi-Fi Camera
                  </button>
                  <button 
                    onClick={() => handleCCTVTypeChange("SOLAR")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition ${cctvType === "SOLAR" ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Sun className="w-3 h-3" /> Solar Camera
                  </button>
                </div>
              </div>
            )}
            
            <p className="text-xs text-slate-500 pt-2">Selecting an option auto-fills the required accessories.</p>
          </div>

          {/* Client Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">2. Client Details</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Client / Lead Name *" 
                value={clientInfo.name}
                onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
              />
              <input 
                type="text" 
                placeholder="Company Name (Optional)" 
                value={clientInfo.company}
                onChange={(e) => setClientInfo({...clientInfo, company: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
              />
              <input 
                type="text" 
                placeholder="Phone Number *" 
                value={clientInfo.phone}
                onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={clientInfo.email}
                onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
              />
              <textarea 
                placeholder="Billing / Site Address" 
                rows={3} 
                value={clientInfo.address}
                onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column (Items & Totals) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">3. Quotation Items</h3>
              <div className="flex gap-3">
                <select 
                  value=""
                  onChange={handleAddOptional}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="" disabled>+ Add Optional Item...</option>
                  {!items.some(i => i.name === "Monitor / LED Display") && <option value="MONITOR">Monitor / LED Display</option>}
                  {!items.some(i => i.name === "Equipment Rack") && <option value="RACK">DVR / NVR Rack</option>}
                  {!items.some(i => i.name === "Camera Box") && <option value="BOX">Camera Box (PVC)</option>}
                  {!items.some(i => i.name === "HDMI Cable") && <option value="HDMI">HDMI Cable</option>}
                  {!items.some(i => i.name === "Wireless Mouse") && <option value="MOUSE">Wireless Mouse</option>}
                  {!items.some(i => i.name === "USB Extension Cable") && <option value="USB">USB Extension</option>}
                  {!items.some(i => i.name === "4G Router / Dongle") && <option value="ROUTER">4G Router / Dongle</option>}
                </select>
                <button onClick={addItem} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-blue-300 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition">
                  <Plus className="w-3 h-3" /> Blank Item
                </button>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                  <div className="text-xs font-bold text-slate-600 w-6 text-center">{index + 1}.</div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <input 
                      type="text" 
                      aria-label="Item name" placeholder="Item Name" 
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" 
                    />
                    {item.options ? (
                      <select
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        {item.options.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        aria-label="Item description" placeholder="Description / Spec" 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                    )}
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="w-20">
                      <label htmlFor={`item-${index}-qty`} className="text-[10px] text-slate-500 uppercase block mb-1">Qty</label>
                      <input 
                        id={`item-${index}-qty`}
                        type="number" 
                        min="1" 
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white text-center" 
                      />
                    </div>
                    <div className="w-28">
                      <label htmlFor={`item-${index}-price`} className="text-[10px] text-slate-500 uppercase block mb-1">Price (₹)</label>
                      <input 
                        id={`item-${index}-price`}
                        type="number" 
                        value={item.price === 0 ? "" : item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white text-right" 
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-24 text-right pt-4 sm:pt-0">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Total</div>
                    <div className="text-sm font-bold text-white">₹ {(item.qty * item.price).toLocaleString()}</div>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded transition sm:mt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="p-5 border-t border-slate-800 bg-slate-800/30 flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-white font-medium">₹ {subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Discount (₹):</span>
                  <input 
                    type="number" 
                    value={discount === 0 ? "" : discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-white text-right" 
                  />
                </div>
                <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-slate-200 font-bold">Total Amount:</span>
                  <span className="text-emerald-400 font-bold text-xl">₹ {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
