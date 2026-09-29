"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, User, Wrench, Trash2, Key, Loader2, AlertCircle, CheckCircle, X, Users, BadgeIndianRupee, Calendar } from "lucide-react";

export default function TeamManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("SALES");
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", email: "", password: "", role: "STAFF", staffType: "SALES",
    phone: "", joiningDate: "", salary: "", attendance: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset Password State
  const [resetModal, setResetModal] = useState<{show: boolean, userId: number | null, userName: string}>({show: false, userId: null, userName: ""});
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg("Staff member added successfully!");
        setFormData({ name: "", email: "", password: "", role: formData.role, staffType: formData.staffType, phone: "", joiningDate: "", salary: "", attendance: "" });
        fetchUsers();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg("");
        }, 2000);
      } else {
        setErrorMsg(data.error || "Failed to create user");
      }
    } catch (error) {
      setErrorMsg("An error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, id: number | null}>({show: false, id: null});

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      const res = await fetch(`/api/admin/team/${deleteConfirm.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModal.userId || !newPassword) return;
    setSubmitLoading(true);
    try {
      const res = await fetch(`/api/admin/team/${resetModal.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password updated successfully!");
        setResetModal({ show: false, userId: null, userName: "" });
        setNewPassword("");
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch (error) {
      alert("Error updating password");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === "ADMIN") return <Shield className="w-4 h-4 text-rose-400" />;
    if (role === "TECHNICIAN") return <Wrench className="w-4 h-4 text-amber-400" />;
    return <User className="w-4 h-4 text-blue-400" />;
  };

  const filteredUsers = users.filter(u => {
    if (activeTab === "SALES") return u.staffType === "SALES" || (!u.staffType && u.role === "STAFF");
    if (activeTab === "SERVICE") return u.staffType === "SERVICE" || (!u.staffType && u.role === "TECHNICIAN");
    return true; // CREDENTIALS tab shows all
  });

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team & Staff Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage admin access, sales staff, and service technicians.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
        >
          <UserPlus className="w-4 h-4" /> Add New Staff
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "SALES", label: "Sales Staff", icon: <Users className="w-4 h-4" /> },
          { id: "SERVICE", label: "Service Staff", icon: <Wrench className="w-4 h-4" /> },
          { id: "CREDENTIALS", label: "Staff Credentials & Details", icon: <Key className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-2 transition ${
              activeTab === tab.id 
                ? "bg-blue-600 text-white" 
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Users List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No staff members found for this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {activeTab !== "CREDENTIALS" ? (
                    <>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4">ID / Name</th>
                      <th className="p-4">Credentials</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Joining Date</th>
                      <th className="p-4 text-right">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    {activeTab !== "CREDENTIALS" ? (
                      <>
                        <td className="p-4 font-bold text-slate-200">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">{u.phone || "-"}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border
                            ${u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                              u.role === 'TECHNICIAN' || u.staffType === 'SERVICE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                              'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                          `}>
                            {getRoleIcon(u.role)}
                            {u.staffType || u.role}
                          </span>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          {u.id !== 1 && (
                            <button 
                              onClick={() => setDeleteConfirm({ show: true, id: u.id })}
                              className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4">
                          <div className="text-xs text-slate-500 mb-0.5">ID: #{u.id}</div>
                          <div className="font-bold text-slate-200">{u.name}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-slate-400">ID/Email: {u.email}</div>
                          <button 
                            onClick={() => setResetModal({ show: true, userId: u.id, userName: u.name })}
                            className="text-[10px] text-blue-400 hover:text-blue-300 mt-1 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-md w-fit"
                          >
                            <Key className="w-3 h-3" /> Reset Password
                          </button>
                        </td>
                        <td className="p-4 font-mono text-emerald-400">{u.salary ? `₹${u.salary}` : "-"}</td>
                        <td className="p-4 text-amber-400">{u.attendance || "-"}</td>
                        <td className="p-4">{u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : "-"}</td>
                        <td className="p-4 text-right">
                          {u.id !== 1 && (
                            <button 
                              onClick={() => setDeleteConfirm({ show: true, id: u.id })}
                              className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Remove Staff Member?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone. They will lose access immediately.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Update Password</h3>
              <button onClick={() => setResetModal({show: false, userId: null, userName: ""})} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <p className="text-xs text-slate-400 mb-4">For: <strong className="text-white">{resetModal.userName}</strong></p>
            <form onSubmit={handleResetPassword}>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
                <input 
                  type="text" 
                  required 
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" 
                  placeholder="Enter new password..." 
                />
              </div>
              <button 
                type="submit"
                disabled={submitLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition flex items-center justify-center"
              >
                {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" /> Add Staff Member
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> 
                  <p>{errorMsg}</p>
                </div>
              )}
              {successMsg && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Rahul Kumar" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email / Login ID *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="rahul@yash.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password *</label>
                    <input type="text" required minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Min 8 chars" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Staff Category</label>
                    <select value={formData.staffType} onChange={e => setFormData({...formData, staffType: e.target.value, role: e.target.value === "SERVICE" ? "TECHNICIAN" : "STAFF"})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500">
                      <option value="SALES">Sales Staff</option>
                      <option value="SERVICE">Service Staff (Technician)</option>
                      <option value="OTHER">Other Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Optional" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Joining Date</label>
                    <input type="date" value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Salary</label>
                    <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 15000" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Attendance Record</label>
                    <input type="text" value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Present (24 Days)" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitLoading}
                    className="flex-[2] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    {submitLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><UserPlus className="w-4 h-4" /> Save Staff Details</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
