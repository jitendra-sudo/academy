"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LeadsManager from "./LeadsManager";
import MediaSettings from "./MediaSettings";
import AccountSettings from "./AccountSettings";
import LecturesManager from "./LecturesManager";

// ─── Sidebar menu ────────────────────────────────────────────────────────────
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊", group: "Main" },
  { id: "site-settings", label: "Site Settings", icon: "🏛️", group: "Content" },
  { id: "contact-settings", label: "Contact Info", icon: "📞", group: "Content" },
  { id: "social-settings", label: "Social Links", icon: "🔗", group: "Content" },
  { id: "stats-settings", label: "Stats & Numbers", icon: "📈", group: "Content" },
  { id: "media-settings", label: "Images & Media", icon: "🖼️", group: "Content" },
  { id: "courses", label: "Courses", icon: "📚", group: "Content" },
  { id: "achievers", label: "Achievers", icon: "🏆", group: "Content" },
  { id: "gallery", label: "Gallery", icon: "📸", group: "Content" },
  { id: "lectures", label: "Lectures", icon: "🎬", group: "Content" },
  { id: "leads", label: "Leads", icon: "🎯", group: "Operations" },
  { id: "admissions", label: "Admissions", icon: "📝", group: "Operations" },
  { id: "reports", label: "Reports", icon: "📊", group: "Operations" },
  { id: "settings", label: "Account", icon: "⚙️", group: "System" },
];

// ─── Re-usable save button ────────────────────────────────────────────────────
function SaveBtn({ onClick, saving, saved }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${saved ? "bg-green-500 text-white" : "bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white"} disabled:opacity-60`}
    >
      {saving ? (
        <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
      ) : saved ? "✅ Saved!" : "Save Changes"}
    </button>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────
function Field({ label, id, value, onChange, type = "text", placeholder = "", hint = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1" htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value || ""} onChange={onChange} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"/>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Textarea Field ───────────────────────────────────────────────────────────
function TextareaField({ label, id, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1" htmlFor={id}>{label}</label>
      <textarea id={id} rows={rows} value={value || ""} onChange={onChange} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none"/>
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, icon, children, onSave, saving, saved }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-black text-gray-900 flex items-center gap-2">{icon} {title}</h2>
        {onSave && <SaveBtn onClick={onSave} saving={saving} saved={saved}/>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function Dashboard({ setSection }) {
  const quickLinks = [
    { label: "Edit Site Name", section: "site-settings", icon: "🏛️", color: "bg-blue-500" },
    { label: "Edit Contact Info", section: "contact-settings", icon: "📞", color: "bg-green-500" },
    { label: "Images & Banners", section: "media-settings", icon: "🖼️", color: "bg-indigo-500" },
    { label: "Manage Courses", section: "courses", icon: "📚", color: "bg-purple-500" },
    { label: "Manage Lectures", section: "lectures", icon: "🎬", color: "bg-rose-500" },
    { label: "Manage Gallery", section: "gallery", icon: "📸", color: "bg-pink-500" },
    { label: "View Leads", section: "leads", icon: "🎯", color: "bg-cyan-500" },
    { label: "Account Settings", section: "settings", icon: "⚙️", color: "bg-slate-500" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map((q) => (
          <button key={q.label} onClick={() => setSection(q.section)}
            className={`${q.color} text-white rounded-2xl p-5 flex items-center gap-3 hover:opacity-90 hover:-translate-y-1 transition-all text-left shadow`}>
            <span className="text-3xl">{q.icon}</span>
            <span className="font-bold text-sm">{q.label}</span>
          </button>
        ))}
      </div>
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl p-5 text-white">
        <h3 className="font-black text-lg mb-1">⚡ CMS Control Panel</h3>
        <p className="text-blue-200 text-sm">You can edit <strong>every part</strong> of the website from this admin panel — site name, logo, contact info, courses, gallery, achievers, stats, and social links. All changes are saved instantly to the site.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════════════════════
function SiteSettings({ settings, onSettingsChange }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (settings?.site) setForm({ ...settings.site }); }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "site", data: form }) });
      const d = await res.json();
      if (d.success) { onSettingsChange(d.data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  const f = (key) => ({ value: form[key] || "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="space-y-5">
      <SectionCard title="Site Identity" icon="🏛️" onSave={save} saving={saving} saved={saved}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Academy Name" id="site-name" placeholder="Mentors Merits Academy" {...f("name")}/>
          <Field label="Logo Letter" id="site-logo" placeholder="M" hint="Single letter shown in the logo circle" {...f("logoLetter")}/>
          <Field label="Tagline (below name)" id="site-tagline" placeholder="ACADEMY" {...f("tagline")}/>
          <Field label="Hero Tagline" id="site-hero-tagline" placeholder="Best UPSC Coaching in India" {...f("heroTagline")}/>
          <Field label="Founded Year" id="site-founded" placeholder="2004" {...f("foundedYear")}/>
          <Field label="Experience (e.g. 20+)" id="site-experience" placeholder="20+" {...f("experience")}/>
        </div>
        <div className="grid md:grid-cols-1 gap-4 mt-4">
          <TextareaField label="Site Description (About Us)" id="site-desc" rows={4} placeholder="About the academy..." value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}/>
          <TextareaField label="Meta Description (SEO)" id="site-meta" rows={2} placeholder="Short description for search engines..." value={form.metaDescription || ""} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}/>
          <Field label="Meta Keywords (SEO)" id="site-keywords" placeholder="UPSC coaching, IAS, TNPSC..." {...f("metaKeywords")}/>
        </div>
        {/* Live Preview */}
        <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Live Logo Preview</p>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-lg flex items-center justify-center">
              <span className="text-white font-black">{form.logoLetter || "M"}</span>
            </div>
            <div>
              <div className="text-[#1e3a8a] font-black text-lg leading-none">{form.name || "Academy Name"}</div>
              <div className="text-amber-600 font-semibold text-xs tracking-widest">{form.tagline || "ACADEMY"}</div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONTACT SETTINGS
// ═══════════════════════════════════════════════════════
function ContactSettings({ settings, onSettingsChange }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [envDefaults, setEnvDefaults] = useState({});
  const [resetting, setResetting] = useState(false);

  // Load current contact settings
  useEffect(() => { if (settings?.contact) setForm({ ...settings.contact }); }, [settings]);

  // Load .env defaults for badge display & reset
  useEffect(() => {
    fetch("/api/contact-numbers")
      .then((r) => r.json())
      .then((d) => { if (d.success) setEnvDefaults(d.envDefaults); });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "contact", data: form }) });
      const d = await res.json();
      if (d.success) { onSettingsChange(d.data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  // Reset phone/whatsapp fields to .env values
  const resetToEnv = async () => {
    if (!confirm("Reset all phone & WhatsApp numbers to .env defaults?")) return;
    setResetting(true);
    const updated = {
      ...form,
      upscPhone:   envDefaults.upscPhone   || form.upscPhone,
      upscPhone2:  envDefaults.upscPhone2  || form.upscPhone2,
      tnpscPhone:  envDefaults.tnpscPhone  || form.tnpscPhone,
      tnpscPhone2: envDefaults.tnpscPhone2 || form.tnpscPhone2,
      whatsapp:    envDefaults.whatsapp    || form.whatsapp,
    };
    setForm(updated);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "contact", data: updated }) });
      const d = await res.json();
      if (d.success) { onSettingsChange(d.data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setResetting(false); }
  };

  const f = (key) => ({ value: form[key] || "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  // EnvBadge — shows a small pill when the current value matches the .env default
  const EnvBadge = ({ fieldKey }) => {
    const isEnvValue = envDefaults[fieldKey] && form[fieldKey] === envDefaults[fieldKey];
    if (!isEnvValue) return null;
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>
        .env
      </span>
    );
  };

  // LabelWithBadge — label row + env badge
  const LabelWithBadge = ({ label, fieldKey }) => (
    <div className="flex items-center mb-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <EnvBadge fieldKey={fieldKey} />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="text-xl mt-0.5">📋</span>
        <div>
          <p className="text-sm font-semibold text-blue-800">Phone & WhatsApp numbers are managed here</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Default values come from your <code className="bg-blue-100 px-1 rounded">.env</code> file.
            Changes saved here override the env defaults permanently.
            <span className="inline-flex items-center gap-1 ml-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/> .env
            </span>
            {" "}badge means the field is using the env value.
          </p>
        </div>
      </div>

      <SectionCard title="Contact Information" icon="📞" onSave={save} saving={saving} saved={saved}>
        {/* Phone Numbers */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">📱 Phone Numbers</h3>
            <button
              onClick={resetToEnv}
              disabled={resetting || !Object.keys(envDefaults).length}
              title="Reset phone & WhatsApp to .env defaults"
              className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              {resetting ? "Resetting..." : "↺ Reset to .env Defaults"}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <LabelWithBadge label="UPSC Phone 1" fieldKey="upscPhone" />
              <input id="c-upsc-phone" type="text" {...f("upscPhone")} placeholder={envDefaults.upscPhone || "+91..."}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"/>
            </div>
            <div>
              <LabelWithBadge label="UPSC Phone 2" fieldKey="upscPhone2" />
              <input id="c-upsc-phone2" type="text" {...f("upscPhone2")} placeholder={envDefaults.upscPhone2 || "+91..."}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"/>
            </div>
            <div>
              <LabelWithBadge label="TNPSC Phone 1" fieldKey="tnpscPhone" />
              <input id="c-tnpsc-phone" type="text" {...f("tnpscPhone")} placeholder={envDefaults.tnpscPhone || "+91..."}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"/>
            </div>
            <div>
              <LabelWithBadge label="TNPSC Phone 2" fieldKey="tnpscPhone2" />
              <input id="c-tnpsc-phone2" type="text" {...f("tnpscPhone2")} placeholder={envDefaults.tnpscPhone2 || "+91..."}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"/>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <h3 className="text-sm font-bold text-emerald-800">WhatsApp Number</h3>
            <EnvBadge fieldKey="whatsapp" />
          </div>
          <input
            id="c-whatsapp"
            type="text"
            {...f("whatsapp")}
            placeholder={envDefaults.whatsapp || "+919003190030"}
            className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <p className="text-xs text-emerald-600 mt-1.5">Include country code (e.g. +91). Used for WhatsApp chat buttons across the site.</p>
        </div>

        {/* Other contact fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Primary Email" id="c-email" type="email" {...f("email")}/>
          <Field label="Enquiry Email" id="c-enquiry-email" type="email" {...f("enquiryEmail")}/>
          <Field label="Address Line 1" id="c-addr1" {...f("address")}/>
          <Field label="Address Line 2" id="c-addr2" {...f("addressLine2")}/>
          <Field label="Working Hours" id="c-hours" placeholder="Mon – Sat: 9AM – 7PM" {...f("workingHours")}/>
          <Field label="Working Hours 2" id="c-hours2" placeholder="Sunday: 10AM – 2PM" {...f("workingHours2")}/>
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SOCIAL SETTINGS
// ═══════════════════════════════════════════════════════
function SocialSettings({ settings, onSettingsChange }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (settings?.social) setForm({ ...settings.social }); }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "social", data: form }) });
      const d = await res.json();
      if (d.success) { onSettingsChange(d.data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  const f = (key) => ({ value: form[key] || "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <SectionCard title="Social Media Links" icon="🔗" onSave={save} saving={saving} saved={saved}>
      <div className="grid md:grid-cols-2 gap-4">
        {["facebook", "twitter", "youtube", "instagram", "linkedin"].map((s) => (
          <Field key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} id={`social-${s}`} placeholder={`https://${s}.com/...`} {...f(s)}/>
        ))}
      </div>
    </SectionCard>
  );
}

// ═══════════════════════════════════════════════════════
// STATS SETTINGS
// ═══════════════════════════════════════════════════════
function StatsSettings({ settings, onSettingsChange }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (settings?.stats) setForm({ ...settings.stats }); }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "stats", data: form }) });
      const d = await res.json();
      if (d.success) { onSettingsChange(d.data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  const fields = [
    { key: "totalSelections", label: "Total Selections" },
    { key: "upscCSE2025", label: "UPSC CSE 2025" },
    { key: "upscIFS2024", label: "UPSC IFS 2024" },
    { key: "tnpscGroup1", label: "TNPSC Group I" },
    { key: "top100", label: "Top 100 Candidates" },
    { key: "totalStudents", label: "Total Aspirants" },
    { key: "branches", label: "No. of Branches" },
    { key: "years", label: "Years of Excellence" },
  ];

  return (
    <SectionCard title="Stats & Numbers" icon="📈" onSave={save} saving={saving} saved={saved}>
      <p className="text-sm text-gray-500 mb-4">These numbers appear in the hero section, footer, and throughout the site.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fields.map((f) => (
          <Field key={f.key} label={f.label} id={`stat-${f.key}`} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}/>
        ))}
      </div>
    </SectionCard>
  );
}

// ═══════════════════════════════════════════════════════
// COURSES MANAGER
// ═══════════════════════════════════════════════════════
function CoursesManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { id, category, items }
  const [newItem, setNewItem] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/courses"); const d = await r.json();
    if (d.success) setCourses(d.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const saveEdit = async () => {
    const res = await fetch("/api/courses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    const d = await res.json();
    if (d.success) { flash("✅ Course updated!"); load(); }
    setEditing(null);
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course category?")) return;
    await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
    flash("🗑️ Deleted"); load();
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setEditing({ ...editing, items: [...editing.items, newItem.trim()] });
    setNewItem("");
  };

  const removeItem = (idx) => setEditing({ ...editing, items: editing.items.filter((_, i) => i !== idx) });

  if (loading) return <div className="text-center py-20 text-gray-400">Loading courses...</div>;

  return (
    <div className="space-y-4">
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">{msg}</div>}

      {editing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-black text-gray-900 mb-4">✏️ Edit: {editing.category}</h3>
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Category Name</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}/>
          </div>
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Course Items</label>
            <div className="space-y-2 mb-3">
              {editing.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-gray-700">{item}</span>
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" placeholder="Add new course item..." value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()}/>
              <button onClick={addItem} className="bg-[#1e3a8a] text-white px-3 py-2 rounded-lg text-sm font-bold">Add</button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={saveEdit} className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">Save</button>
            <button onClick={() => setEditing(null)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-bold text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        courses.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`${cat.accent || "bg-gray-700"} text-white px-3 py-1 rounded-lg text-sm font-bold`}>{cat.category}</div>
              <div className="flex gap-2">
                <button onClick={() => setEditing({ ...cat })} className="text-[#1e3a8a] text-sm font-semibold hover:underline">✏️ Edit</button>
                <button onClick={() => deleteCourse(cat.id)} className="text-red-500 text-sm font-semibold hover:underline">🗑️ Delete</button>
              </div>
            </div>
            <ul className="space-y-1">
              {cat.items.slice(0, 4).map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
                  {item}
                </li>
              ))}
              {cat.items.length > 4 && <li className="text-xs text-gray-400">+{cat.items.length - 4} more...</li>}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ACHIEVERS MANAGER
// ═══════════════════════════════════════════════════════
function AchieversManager() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", rank: "", course: "", year: "", exam: "UPSC CSE" });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/achievers"); const d = await r.json();
    if (d.success) setList(d.data);
  }, []);

  useEffect(() => { load(); }, [load]);
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = async () => {
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    const r = await fetch("/api/achievers", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.success) { flash(editing ? "✅ Updated!" : "✅ Added!"); load(); setForm({ name: "", rank: "", course: "", year: "", exam: "UPSC CSE" }); setEditing(null); }
  };

  const del = async (id) => {
    if (!confirm("Delete this achiever?")) return;
    await fetch(`/api/achievers?id=${id}`, { method: "DELETE" });
    flash("🗑️ Deleted"); load();
  };

  const startEdit = (a) => { setEditing(a); setForm({ name: a.name, rank: a.rank, course: a.course, year: a.year, exam: a.exam }); };

  const f = (key) => ({ value: form[key] || "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="space-y-5">
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">{msg}</div>}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-black text-gray-900 mb-4">{editing ? "✏️ Edit Achiever" : "➕ Add Achiever / Topper"}</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Field label="Full Name" id="ach-name" placeholder="ISHITA KISHORE" {...f("name")}/>
          <Field label="Rank" id="ach-rank" placeholder="AIR 01" {...f("rank")}/>
          <Field label="Exam" id="ach-exam" placeholder="UPSC CSE" {...f("exam")}/>
          <Field label="Year" id="ach-year" placeholder="2025" {...f("year")}/>
          <div className="md:col-span-2">
            <Field label="Course / Batch" id="ach-course" placeholder="Foundation Batch 2025" {...f("course")}/>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">
            {editing ? "Update" : "Add Achiever"}
          </button>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: "", rank: "", course: "", year: "", exam: "UPSC CSE" }); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-bold text-sm">Cancel</button>}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><h3 className="font-black text-gray-900">All Achievers ({list.length})</h3></div>
        <div className="divide-y divide-gray-50">
          {list.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                {a.rank?.split(" ")[1] || "#"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm">{a.name}</div>
                <div className="text-amber-600 text-xs font-semibold">{a.rank} · {a.exam} {a.year}</div>
                <div className="text-gray-500 text-xs truncate">{a.course}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(a)} className="text-[#1e3a8a] text-xs font-bold hover:underline">Edit</button>
                <button onClick={() => del(a.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// GALLERY MANAGER
// ═══════════════════════════════════════════════════════
const GALLERY_CATS = ["Classroom", "Toppers", "Events", "Interviews", "Online", "Study"];
const GALLERY_EMOJIS = ["🏫", "🏆", "🎊", "🎙️", "💻", "📚", "📸", "🎂", "⭐", "🗺️", "🌳", "👨‍🏫", "✍️"];

function GalleryManager() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ category: "Classroom", title: "", desc: "", event: "", date: "", emoji: "📸", tag: "", bg: "from-blue-900 to-blue-700" });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/gallery"); const d = await r.json();
    if (d.success) setList(d.data);
  }, []);

  useEffect(() => { load(); }, [load]);
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = async () => {
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    const r = await fetch("/api/gallery", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.success) { flash(editing ? "✅ Updated!" : "✅ Added!"); load(); setForm({ category: "Classroom", title: "", desc: "", event: "", date: "", emoji: "📸", tag: "", bg: "from-blue-900 to-blue-700" }); setEditing(null); }
  };

  const del = async (id) => {
    if (!confirm("Delete this gallery item?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    flash("🗑️ Deleted"); load();
  };

  const startEdit = (g) => { setEditing(g); setForm({ category: g.category, title: g.title, desc: g.desc, event: g.event, date: g.date, emoji: g.emoji, tag: g.tag, bg: g.bg }); };

  const f = (key) => ({ value: form[key] || "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="space-y-5">
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">{msg}</div>}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-black text-gray-900 mb-4">{editing ? "✏️ Edit Gallery Item" : "➕ Add Gallery Item"}</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white">
              {GALLERY_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Emoji Icon</label>
            <div className="flex gap-1 flex-wrap">
              {GALLERY_EMOJIS.map((e) => (
                <button key={e} onClick={() => setForm({ ...form, emoji: e })} className={`text-xl p-1 rounded-lg ${form.emoji === e ? "bg-blue-100 ring-2 ring-[#1e3a8a]" : "hover:bg-gray-100"}`}>{e}</button>
              ))}
            </div>
          </div>
          <Field label="Title" id="gal-title" placeholder="Event title..." {...f("title")}/>
          <Field label="Tag" id="gal-tag" placeholder="AIR 02, New Branch..." {...f("tag")}/>
          <Field label="Event Name" id="gal-event" placeholder="Felicitation Ceremony" {...f("event")}/>
          <Field label="Date" id="gal-date" placeholder="Jan 2025" {...f("date")}/>
          <div className="md:col-span-2">
            <TextareaField label="Description" id="gal-desc" rows={2} placeholder="Brief description..." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}/>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">
            {editing ? "Update" : "Add Item"}
          </button>
          {editing && <button onClick={() => { setEditing(null); setForm({ category: "Classroom", title: "", desc: "", event: "", date: "", emoji: "📸", tag: "", bg: "from-blue-900 to-blue-700" }); }} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-bold text-sm">Cancel</button>}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-gray-900">Gallery Items ({list.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {list.map((g) => (
            <div key={g.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center text-xl shrink-0">{g.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm truncate">{g.title}</div>
                <div className="text-xs text-gray-500">{g.category} · {g.event} · {g.date}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(g)} className="text-[#1e3a8a] text-xs font-bold hover:underline">Edit</button>
                <button onClick={() => del(g.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ADMISSIONS LIST
// ═══════════════════════════════════════════════════════
const STATUS_COLORS = { Confirmed: "bg-green-100 text-green-700", Pending: "bg-amber-100 text-amber-700", "Under Review": "bg-blue-100 text-blue-700" };

function AdmissionsList() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (search) params.set("q", search);
    const r = await fetch(`/api/admissions?${params}`);
    const d = await r.json();
    if (d.success) setList(d.data);
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, course, city..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white">
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Student", "Phone", "Course", "City", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3"><div className="font-semibold text-gray-900">{a.name}</div><div className="text-gray-400 text-xs">{a.id}</div></td>
                <td className="px-5 py-3 text-gray-600">{a.phone}</td>
                <td className="px-5 py-3 text-gray-600 max-w-40 truncate">{a.course}</td>
                <td className="px-5 py-3 text-gray-500">{a.city}</td>
                <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span></td>
                <td className="px-5 py-3 text-gray-400 text-xs">{a.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div className="text-center py-12 text-gray-400">No admissions found.</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════
function Sidebar({ active, setActive, sidebarOpen, setSidebarOpen, onLogout, siteName }) {
  const groups = [...new Set(menuItems.map((m) => m.group))];
  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}/>}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] z-30 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.jpg"
              alt="Mentors Merits Academy"
              className="w-10 h-10 object-contain rounded-full shrink-0 bg-white/10"
            />
            <div className="min-w-0">
              <div className="text-white font-black text-xs leading-tight truncate">{siteName || "MENTORS MERITS"}</div>
              <div className="text-amber-400 text-xs">Admin CMS</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <div className="text-blue-300/60 text-xs font-semibold uppercase tracking-wider px-3 mb-1">{group}</div>
              {menuItems.filter((m) => m.group === group).map((item) => (
                <button key={item.id} id={`admin-nav-${item.id}`}
                  onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-0.5 ${active === item.id ? "bg-white/20 text-white shadow-lg" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">← View Website</Link>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-300 hover:text-red-200 text-sm w-full transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════
export function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    if (!isAuth) { router.replace("/admin/login"); return; }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.success) setSettings(d.data); });
  }, [authChecked]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-[#1e3a8a]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span className="text-gray-500 text-sm">Checking authentication...</span>
      </div>
    </div>
  );

  const currentMenu = menuItems.find((m) => m.id === section);
  const siteName = settings?.site?.name?.toUpperCase() || "MENTORS MERITS";

  const renderSection = () => {
    switch (section) {
      case "dashboard": return <Dashboard setSection={setSection}/>;
      case "site-settings": return <SiteSettings settings={settings} onSettingsChange={setSettings}/>;
      case "contact-settings": return <ContactSettings settings={settings} onSettingsChange={setSettings}/>;
      case "social-settings": return <SocialSettings settings={settings} onSettingsChange={setSettings}/>;
      case "stats-settings": return <StatsSettings settings={settings} onSettingsChange={setSettings}/>;
      case "courses": return <CoursesManager/>;
      case "achievers": return <AchieversManager/>;
      case "gallery": return <GalleryManager/>;
      case "lectures": return <LecturesManager/>;
      case "media-settings": return <MediaSettings settings={settings} onSettingsChange={setSettings}/>;
      case "leads": return <LeadsManager/>;
      case "admissions": return <AdmissionsList/>;
      case "settings": return <AccountSettings/>;
      default: return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="text-5xl mb-3">{currentMenu?.icon}</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">{currentMenu?.label}</h2>
          <p className="text-gray-500 mb-6">This section will be available in the next update.</p>
          <button onClick={() => setSection("dashboard")} className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors">← Back to Dashboard</button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar active={section} setActive={setSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} siteName={siteName}/>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)} id="admin-sidebar-toggle" aria-label="Open sidebar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div>
              <h1 className="font-black text-gray-900 text-base">{currentMenu?.icon} {currentMenu?.label}</h1>
              <p className="text-gray-400 text-xs">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/gallery" target="_blank" className="hidden sm:flex text-xs text-gray-500 hover:text-[#1e3a8a] items-center gap-1">📸 Gallery</Link>
            <Link href="/" target="_blank" className="hidden sm:flex text-xs text-gray-500 hover:text-[#1e3a8a] items-center gap-1">🌐 Website</Link>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">CMS</div>
              </div>
            </div>
            <button id="admin-logout-header-btn" onClick={handleLogout} title="Logout" className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" aria-label="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
