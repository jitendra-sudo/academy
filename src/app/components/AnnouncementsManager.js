"use client";
import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/lib/api";

const EMPTY_FORM = {
  text: "",
  link: "",
  isActive: true,
  order: 0,
};

export default function AnnouncementsManager() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(apiUrl("/api/announcements?all=true"));
      const d = await r.json();
      if (d.success) setList(d.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = async () => {
    if (!form.text.trim()) return alert("Text is required");
    setSaving(true);
    try {
      const isEdit = !!editing;
      const url = isEdit ? `/api/announcements/${editing._id}` : "/api/announcements";
      const method = isEdit ? "PUT" : "POST";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
      };
      const r = await fetch(apiUrl(url), { method, headers, body: JSON.stringify(form) });
      const d = await r.json();
      if (d.success) {
        flash(isEdit ? "✅ Updated" : "✅ Created");
        setForm(EMPTY_FORM);
        setEditing(null);
        load();
      }
    } catch { /* ignore */ }
    finally { setSaving(true); setTimeout(()=>setSaving(false), 500); }
  };

  const del = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    const headers = { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
    const r = await fetch(apiUrl(`/api/announcements/${id}`), { method: "DELETE", headers });
    const d = await r.json();
    if (d.success) { flash("🗑️ Deleted"); load(); }
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({ text: item.text, link: item.link || "", isActive: item.isActive, order: item.order || 0 });
  };

  return (
    <div className="space-y-6">
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">{msg}</div>}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            {editing ? "✏️ Edit Announcement" : "➕ New Announcement"}
          </h2>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); }} className="text-gray-400 hover:text-gray-600 text-sm font-semibold">✕ Cancel</button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Text *</label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="e.g. UPSC Prelims 2026 Batch Starting from July 1st"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Link URL (Optional)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="e.g. /#admission"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">Active (Visible on website)</span>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2"
          >
            {saving ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Active & Previous Announcements ({list.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : list.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No announcements yet</div>
          ) : (
            list.map((item) => (
              <div key={item._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-gray-400">Order: {item.order || 0}</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm line-clamp-2">{item.text}</p>
                  {item.link && <p className="text-xs text-blue-600 truncate">{item.link}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">✏️</button>
                  <button onClick={() => del(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
