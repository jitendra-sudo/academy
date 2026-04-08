"use client";
import { useState, useEffect, useCallback } from "react";

const LEAD_STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-600",
};

const SOURCE_COLORS = {
  admission: "bg-purple-100 text-purple-700",
  "contact-modal": "bg-cyan-100 text-cyan-700",
  whatsapp: "bg-green-100 text-green-700",
  website: "bg-gray-100 text-gray-600",
};

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [totals, setTotals] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const p = new URLSearchParams();
    if (filter !== "all") p.set("status", filter);
    if (sourceFilter !== "all") p.set("source", sourceFilter);
    if (search) p.set("q", search);
    try {
      const r = await fetch("/api/leads?" + p.toString());
      const d = await r.json();
      if (d.success) {
        setLeads(d.data);
        setTotals({ total: d.total, new: d.new, contacted: d.contacted, converted: d.converted });
      }
    } catch { /* ignore */ }
  }, [filter, sourceFilter, search]);

  useEffect(() => { load(); }, [load]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const updateStatus = async (id, status) => {
    const r = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const d = await r.json();
    if (d.success) { flash("✅ Status updated!"); load(); }
  };

  const deleteLead = async (id) => {
    if (!confirm("Delete this lead permanently?")) return;
    await fetch("/api/leads?id=" + id, { method: "DELETE" });
    flash("🗑️ Lead deleted"); load();
  };

  const fmt = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "-";

  const statCards = [
    { l: "Total Leads", v: totals.total, c: "from-blue-500 to-blue-600", i: "🎯" },
    { l: "New", v: totals.new, c: "from-indigo-500 to-indigo-600", i: "🆕" },
    { l: "Contacted", v: totals.contacted, c: "from-amber-500 to-amber-600", i: "📞" },
    { l: "Converted", v: totals.converted, c: "from-green-500 to-green-600", i: "✅" },
  ];

  return (
    <div className="space-y-5">
      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
          {msg}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.l} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`bg-gradient-to-br ${s.c} w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow`}>
              {s.i}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{s.v}</div>
              <div className="text-gray-500 text-xs">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, email, course..."
              className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">🆕 New</option>
              <option value="contacted">📞 Contacted</option>
              <option value="converted">✅ Converted</option>
              <option value="lost">❌ Lost</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white"
            >
              <option value="all">All Sources</option>
              <option value="admission">Admission Form</option>
              <option value="contact-modal">Contact Modal</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <button
              onClick={load}
              className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1d4ed8] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Lead", "Phone", "Course / City", "Source", "Status", "Received", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead, idx) => (
                <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{lead.name}</div>
                    <div className="text-gray-400 text-xs">{lead.email || lead.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <a href={"tel:" + lead.phone} className="text-[#1e3a8a] font-bold hover:underline text-sm">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700 font-medium truncate max-w-40">{lead.course}</div>
                    <div className="text-gray-400 text-xs">{lead.city}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={"px-2 py-1 rounded-full text-xs font-semibold capitalize " + (SOURCE_COLORS[lead.source] || "bg-gray-100 text-gray-600")}>
                      {(lead.source || "website").replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={"text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer outline-none " + (LEAD_STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600")}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {fmt(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a href={"tel:" + lead.phone} title="Call" className="text-green-600 hover:scale-125 transition-transform text-base">📞</a>
                      <a
                        href={"https://wa.me/" + (lead.phone || "").replace(/\D/g, "")}
                        target="_blank" rel="noreferrer"
                        title="WhatsApp"
                        className="text-green-500 hover:scale-125 transition-transform text-base"
                      >💬</a>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        title="Delete"
                        className="text-red-500 hover:scale-125 transition-transform text-base"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-gray-500 font-semibold mb-1">No leads yet</p>
              <p className="text-gray-400 text-sm">
                Leads from the admission form and contact modal will appear here automatically.
              </p>
            </div>
          )}
        </div>

        {leads.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Showing {leads.length} lead{leads.length !== 1 ? "s" : ""}</span>
            <span className="text-xs text-gray-400">Click phone to call · 💬 to WhatsApp · Status dropdown to update</span>
          </div>
        )}
      </div>
    </div>
  );
}
