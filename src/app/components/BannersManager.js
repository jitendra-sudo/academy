"use client";
import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/lib/api";
import ImageUploader from "./ImageUploader";

const POSITIONS = ["home", "courses", "achievers", "gallery", "about"];

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  position: "home",
  imageUrl: "",
  link: "",
  linkLabel: "",
  order: 0,
  active: true,
};

export default function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list view, "new" = new form, object = edit form
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const [filterPos, setFilterPos] = useState("all");

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Pass ?all=true so the admin sees both published and unpublished banners
      const base = filterPos === "all"
        ? apiUrl("/api/banners?all=true")
        : apiUrl(`/api/banners?all=true&position=${filterPos}`);
      const r = await fetch(base);
      const d = await r.json();
      if (d.success) setBanners(d.data || []);
    } catch {
      flash("Failed to load banners", "error");
    } finally {
      setLoading(false);
    }
  }, [filterPos]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM });
    setEditing("new");
  };

  const openEdit = (banner) => {
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      position: banner.position || "home",
      imageUrl: banner.imageUrl || "",
      link: banner.link || "",
      linkLabel: banner.linkLabel || "",
      order: banner.order ?? 0,
      // DB stores `isPublished`; frontend form uses `active`
      active: banner.isPublished !== false && banner.active !== false,
    });
    setEditing(banner);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const save = async () => {
    if (!form.title.trim()) { flash("Title is required", "error"); return; }
    setSaving(true);
    try {
      const isEdit = editing && editing !== "new";
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? apiUrl(`/api/banners/${editing._id || editing.id}`)
        : apiUrl("/api/banners");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
      };
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const d = await res.json();
      if (d.success) {
        flash(isEdit ? "✅ Banner updated!" : "✅ Banner created!");
        cancel();
        load();
      } else {
        flash(d.error || "Save failed", "error");
      }
    } catch {
      flash("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteBanner = async (banner) => {
    if (!confirm(`Delete banner "${banner.title}"?`)) return;
    try {
      const headers = { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
      const res = await fetch(apiUrl(`/api/banners/${banner._id || banner.id}`), { method: "DELETE", headers });
      const d = await res.json();
      if (d.success) { flash("🗑️ Banner deleted"); load(); }
      else flash(d.error || "Delete failed", "error");
    } catch {
      flash("Network error", "error");
    }
  };

  const f = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  // ─── Form View ────────────────────────────────────────────────────────────
  if (editing !== null) {
    const isEdit = editing && editing !== "new";
    return (
      <div className="space-y-5">
        {/* Flash */}
        {msg.text && (
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === "error" ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
            {msg.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              🖼️ {isEdit ? `Edit Banner: ${editing.title}` : "Add New Banner"}
            </h2>
            <button onClick={cancel} className="text-gray-400 hover:text-gray-600 text-sm font-semibold">✕ Cancel</button>
          </div>

          <div className="p-5 space-y-6">
            {/* Image */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <ImageUploader
                label="Banner Image"
                currentUrl={form.imageUrl}
                folder="banner"
                onUploaded={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                aspectHint="16:9 or wider — 1920×600px recommended"
                hint="Upload the banner image (JPG, PNG, WebP)"
              />
              {/* Manual URL override */}
              <div className="mt-3">
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Or paste image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
              </div>
            </div>

            {/* Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  {...f("title")}
                  placeholder="UPSC 2026 Admissions Open"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Subtitle</label>
                <input
                  type="text"
                  {...f("subtitle")}
                  placeholder="Join Tamil Nadu's #1 coaching centre"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Position (Page)</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white"
                >
                  {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Button Label</label>
                <input
                  type="text"
                  {...f("linkLabel")}
                  placeholder="Book Admission Now"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Button Link</label>
                <input
                  type="text"
                  {...f("link")}
                  placeholder="#admission or /courses"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#1e3a8a] rounded-full peer peer-checked:bg-[#1e3a8a] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
              </div>
            </div>

            {/* Preview */}
            {form.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200 relative">
                <p className="text-xs text-gray-400 font-semibold uppercase px-3 py-2 bg-gray-50 border-b border-gray-100">Preview</p>
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={form.imageUrl}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end p-4">
                    <p className="text-white font-black text-base leading-tight drop-shadow">{form.title || "Banner Title"}</p>
                    {form.subtitle && <p className="text-amber-400 text-xs font-semibold mt-0.5">{form.subtitle}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                disabled={saving}
                className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {saving ? "Saving..." : isEdit ? "Update Banner" : "Create Banner"}
              </button>
              <button onClick={cancel} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────────
  const displayed = filterPos === "all" ? banners : banners.filter((b) => b.position === filterPos);

  return (
    <div className="space-y-5">
      {/* Flash */}
      {msg.text && (
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === "error" ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", ...POSITIONS].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPos(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filterPos === p ? "bg-[#1e3a8a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shrink-0"
        >
          ➕ Add Banner
        </button>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="text-xl">🖼️</span>
        <div>
          <p className="text-sm font-semibold text-blue-800">Hero Slider Banners</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Banners added here appear in the hero slider on the website. Upload an image, set a title, and choose which page/position to display it on.
          </p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading banners...
        </div>
      ) : displayed.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center shadow-sm">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="font-bold text-gray-700 mb-1">No banners yet</p>
          <p className="text-sm text-gray-400 mb-4">
            {filterPos === "all" ? "Create your first banner to display in the hero slider" : `No banners for "${filterPos}" position`}
          </p>
          <button onClick={openNew} className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">
            ➕ Add First Banner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900">Banners ({displayed.length})</h3>
            <span className="text-xs text-gray-400">Sorted by order</span>
          </div>
          <div className="divide-y divide-gray-50">
            {[...displayed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((banner) => (
              <div key={banner._id || banner.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {/* Thumbnail */}
                <div className="w-20 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] shrink-0 flex items-center justify-center">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl">🖼️</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm truncate">{banner.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${(banner.isPublished || banner.active) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                      {(banner.isPublished || banner.active) ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {banner.subtitle && <div className="text-xs text-gray-500 truncate mt-0.5">{banner.subtitle}</div>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold capitalize">{banner.position || "home"}</span>
                    <span className="text-xs text-gray-400">Order: {banner.order ?? 0}</span>
                    {banner.link && <span className="text-xs text-gray-400 truncate max-w-32">→ {banner.link}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => openEdit(banner)} className="text-[#1e3a8a] text-xs font-bold hover:underline">✏️ Edit</button>
                  <button onClick={() => deleteBanner(banner)} className="text-red-500 text-xs font-bold hover:underline">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
