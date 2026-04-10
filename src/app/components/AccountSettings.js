"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

export default function AccountSettings() {
  const [currentUsername, setCurrentUsername] = useState("");
  const [form, setForm] = useState({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
    fetch(apiUrl("/api/auth/credentials"), { headers }).then(r => r.json()).then(d => {
      if (d.success) setCurrentUsername(d.username);
    });
  }, []);

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: "", text: "" }), 5000); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.currentPassword) { flash("error", "Current password is required."); return; }
    if (form.newPassword && form.newPassword !== form.confirmPassword) { flash("error", "New passwords do not match."); return; }
    if (form.newPassword && form.newPassword.length < 8) { flash("error", "New password must be at least 8 characters."); return; }
    if (!form.newUsername && !form.newPassword) { flash("error", "Enter a new username or new password to update."); return; }

    setSaving(true);
    try {
      const res = await fetch(apiUrl("/api/auth/credentials"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newUsername: form.newUsername || undefined,
          newPassword: form.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        flash("success", data.message);
        if (data.username) setCurrentUsername(data.username);
        setForm({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
      } else {
        flash("error", data.error || "Failed to update credentials.");
      }
    } catch {
      flash("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const togglePwd = (field) => setShowPwd(prev => ({ ...prev, [field]: !prev[field] }));

  const pwdInput = (id, field, placeholder, toggleKey) => (
    <div className="relative">
      <input id={id} type={showPwd[toggleKey] ? "text" : "password"}
        value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
      <button type="button" onClick={() => togglePwd(toggleKey)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
        {showPwd[toggleKey]
          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        }
      </button>
    </div>
  );

  return (
    <div className="space-y-5 max-w-xl">
      {/* Current info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">👤 Current Account</h2>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-black">
            {(currentUsername[0] || "A").toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-gray-900">{currentUsername || "admin"}</div>
            <div className="text-xs text-gray-500">Administrator · Full Access</div>
          </div>
        </div>
      </div>

      {/* Change credentials */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-black text-gray-900 flex items-center gap-2">🔑 Change Username / Password</h2>
          <p className="text-gray-500 text-xs mt-1">You must enter your current password to make any changes.</p>
        </div>
        <div className="p-5">
          {msg.text && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${msg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
              {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1" htmlFor="acc-current-pwd">Current Password *</label>
              {pwdInput("acc-current-pwd", "currentPassword", "Enter current password", "current")}
            </div>

            <hr className="border-gray-100"/>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1" htmlFor="acc-new-username">New Username (optional)</label>
              <input id="acc-new-username" type="text" value={form.newUsername}
                onChange={e => setForm(prev => ({ ...prev, newUsername: e.target.value }))}
                placeholder={`Current: ${currentUsername || "admin"}`}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1" htmlFor="acc-new-pwd">New Password (optional)</label>
              {pwdInput("acc-new-pwd", "newPassword", "Min 8 characters", "new")}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1" htmlFor="acc-confirm-pwd">Confirm New Password</label>
              {pwdInput("acc-confirm-pwd", "confirmPassword", "Re-enter new password", "confirm")}
              {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">⚠️ Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Updating...</>
                : "Update Credentials"}
            </button>
          </form>
        </div>
      </div>

      {/* Security note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <h3 className="font-bold text-amber-800 text-sm mb-1">🔒 Security Tips</h3>
        <ul className="text-amber-700 text-xs space-y-1 list-disc pl-4">
          <li>Use a password with at least 12 characters, including numbers and symbols</li>
          <li>Never share your admin credentials with anyone</li>
          <li>Credentials are stored securely in <code className="bg-amber-100 px-1 rounded">src/data/credentials.json</code></li>
          <li>After changing credentials, you&apos;ll need to log in again on your next session</li>
        </ul>
      </div>
    </div>
  );
}
