"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Store, 
  School, 
  Hospital, 
  Factory, 
  Warehouse, 
  Landmark, 
  Hotel,
  ShieldCheck,
  Search,
  LayoutGrid,
  List
} from "lucide-react";

// Category to Icon mapping helper
function getCategoryIcon(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("school") || cat.includes("college") || cat.includes("education")) return School;
  if (cat.includes("hospital") || cat.includes("health") || cat.includes("clinic")) return Hospital;
  if (cat.includes("mall") || cat.includes("retail") || cat.includes("shop") || cat.includes("showroom")) return Store;
  if (cat.includes("warehouse") || cat.includes("logistics") || cat.includes("storage")) return Warehouse;
  if (cat.includes("bank") || cat.includes("financial")) return Landmark;
  if (cat.includes("hotel") || cat.includes("resort") || cat.includes("hospitality")) return Hotel;
  if (cat.includes("factory") || cat.includes("mill") || cat.includes("plant") || cat.includes("manufacturing")) return Factory;
  return Building2;
}

interface Client {
  id: number;
  name: string;
  category: string;
  badge: string;
  logoUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Commercial Retail",
    badge: "",
    sortOrder: "0",
    isActive: true,
  });

  const categories = [
    "Retail & Shopping Complex",
    "Educational Campus",
    "Healthcare Facility",
    "Logistics & Storage",
    "Financial Institution",
    "Hospitality & Hotel",
    "Gated Apartment Society",
    "Manufacturing Plant",
    "Corporate Office",
    "Government / PSU",
  ];

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients?all=true");
      const data = await res.json();
      if (data.clients) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Commercial Retail",
      badge: "32 Cameras + AMC",
      sortOrder: (clients.length + 1).toString(),
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      category: client.category,
      badge: client.badge,
      sortOrder: client.sortOrder.toString(),
      isActive: client.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        // UPDATE
        const res = await fetch(`/api/clients/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setShowModal(false);
          fetchClients();
        } else {
          alert("Failed to update client");
        }
      } else {
        // CREATE
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setShowModal(false);
          fetchClients();
        } else {
          alert("Failed to add client");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove client "${name}"?`)) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients(clients.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete client");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting client");
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !client.isActive }),
      });
      if (res.ok) {
        setClients(
          clients.map((c) => (c.id === client.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.badge.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Clients & Deployments</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {clients.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage corporate clients displayed on the continuous loop ticker on the website homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchClients}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Add New Client
          </button>
        </div>
      </div>

      {/* Search & View Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search client by name, category, or badge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* View Mode Toggle: Cards (Default) vs Table */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "cards"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Small Cards View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "table"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Clients Display: Small Cards Grid or Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-slate-400">
          Loading client details from database...
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-slate-500 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700">No clients found</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition"
          >
            Add First Client
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* Small Size Card Style Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map((client) => {
            const Icon = getCategoryIcon(client.category);
            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 p-4 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon, Sort Order & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        #{client.sortOrder}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleActive(client)}
                      title="Click to toggle active on website"
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition ${
                        client.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {client.isActive ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inactive
                        </>
                      )}
                    </button>
                  </div>

                  {/* Client Details */}
                  <div className="space-y-1">
                    <h3
                      className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                      title={client.name}
                    >
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                      {client.category}
                    </p>
                    <div className="pt-1.5">
                      <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
                        🛡️ {client.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: ID & Edit / Delete */}
                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-400">
                    ID #{client.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(client)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-blue-600 hover:bg-blue-50 text-xs font-bold transition"
                      title="Edit client"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-red-500 hover:bg-red-50 text-xs font-bold transition"
                      title="Delete client"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Client Name</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Security Deployment Badge</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-400">
                      #{client.sortOrder}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span>{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">
                      {client.category}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
                        {client.badge}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => handleToggleActive(client)}
                        title="Click to toggle active on website"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                          client.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {client.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(client)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        title="Edit client"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                        title="Delete client"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">
                {editingId ? "Edit Client" : "Add New Client Deployment"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Client / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patna Central Mall"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deployment Highlight Badge *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 64 Cameras + AMC or Face AI Attendance"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Shown as the highlight chip on the website ticker.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Display Status
                  </label>
                  <select
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.value === "true" })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="true">Active (Show on loop)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}