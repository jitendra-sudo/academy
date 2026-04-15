"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiUrl } from "@/lib/api";

const COURSES = [
  "UPSC CSE", "UPSC IFS", "UPSC EPFO", "TNPSC Group I",
  "TNPSC Group II", "TNPSC Group IV", "Banking / SSC", "General", "Others",
];

const SUBJECTS = [
  "History", "Geography", "Polity", "Economy", "Environment",
  "Science & Tech", "Current Affairs", "General Studies", "Optional Subject",
  "Essay", "Ethics", "Interview Guidance", "General English", "Mathematics", "Others",
];

const VIDEO_TYPES = [
  { value: "youtube", label: "YouTube Link", icon: "▶️" },
  { value: "drive", label: "Google Drive Link", icon: "📁" },
  { value: "upload", label: "Upload Video to R2", icon: "☁️" },
  { value: "vimeo", label: "Vimeo Link", icon: "🎬" },
];

// ─── Helper: extract YouTube thumbnail ────────────────────────────────────────
function ytThumb(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}

// ─── Helper: extract video embed URL ─────────────────────────────────────────
function toEmbedUrl(url, type) {
  if (type === "youtube") {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\s?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : url;
  }
  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  }
  if (type === "drive") {
    // Convert share link to embed link
    const match = url.match(/\/file\/d\/([^/]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
  }
  return url;
}

// ─── VideoUploader component ──────────────────────────────────────────────────
function VideoUploader({ onUploaded, uploadProgress, setUploadProgress }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const upload = async (file) => {
    if (!file) return;
    setError("");
    setResult(null);

    const ALLOWED = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/mpeg", "video/3gpp"];
    if (!ALLOWED.includes(file.type)) {
      setError("Unsupported format. Use MP4, WebM, MOV, or AVI.");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError("File too large. Maximum 500MB.");
      return;
    }

    setUploading(true);
    setUploadProgress?.(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "lectures");

      // Use XMLHttpRequest for progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl("/api/upload"));
        xhr.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem("admin_token")}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress?.(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
              setResult(data);
              onUploaded?.(data.url, file.name, data.sizeMB);
              resolve(data);
            } else if (data.setupRequired) {
              setError("R2 not configured. Please add R2 credentials to .env.local first.");
              reject(new Error("R2 not configured"));
            } else {
              setError(data.error || "Upload failed.");
              reject(new Error(data.error));
            }
          } catch {
            setError("Upload failed. Please try again.");
            reject(new Error("Parse error"));
          }
        };
        xhr.onerror = () => { setError("Network error. Check your connection."); reject(new Error("Network error")); };
        xhr.send(formData);
      });
    } catch {
      // error already set
    } finally {
      setUploading(false);
      setUploadProgress?.(0);
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-[#1e3a8a] bg-blue-50" : "border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50/40"}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/mpeg"
          className="hidden"
          onChange={(e) => upload(e.target.files[0])}
        />
        {uploading ? (
          <div className="space-y-3">
            <div className="text-3xl">☁️</div>
            <p className="text-sm font-semibold text-gray-700">Uploading to Cloudflare R2...</p>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#1e3a8a] to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-mono">{uploadProgress || 0}% uploaded</p>
          </div>
        ) : result ? (
          <div className="space-y-2">
            <div className="text-3xl">✅</div>
            <p className="text-sm font-bold text-green-700">Uploaded successfully!</p>
            <p className="text-xs text-gray-500">{result.name} · {result.sizeMB}MB</p>
            <button onClick={(e) => { e.stopPropagation(); setResult(null); }} className="text-xs text-blue-600 underline">Upload another</button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">🎬</div>
            <p className="text-sm font-semibold text-gray-700">Drag & drop your lecture video here</p>
            <p className="text-xs text-gray-400">MP4, WebM, MOV, AVI · Max 500MB</p>
            <div className="inline-flex items-center gap-1 bg-[#1e3a8a] text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
              <span>Browse Files</span>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// ─── Main LecturesManager ─────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", description: "", course: "UPSC CSE", subject: "General Studies",
  instructor: "", videoUrl: "", videoType: "youtube", thumbnailUrl: "",
  duration: "", isPublic: true, isFeatured: false,
};

export default function LecturesManager() {
  const [lectures, setLectures] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState({ course: "all", subject: "all", q: "" });
  const [view, setView] = useState("grid");
  const [preview, setPreview] = useState(null); // lecture to preview in modal
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("list"); // "list" | "add"

  const load = useCallback(async () => {
    const p = new URLSearchParams();
    if (filter.course !== "all") p.set("course", filter.course);
    if (filter.subject !== "all") p.set("subject", filter.subject);
    if (filter.q) p.set("q", filter.q);
    const r = await fetch(apiUrl("/api/lectures?" + p.toString()));
    const d = await r.json();
    if (d.success) setLectures(d.data);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const flash = (m, isErr = false) => {
    isErr ? setError(m) : setMsg(m);
    setTimeout(() => isErr ? setError("") : setMsg(""), 4000);
  };

  // Auto-fill YouTube thumbnail when URL changes
  useEffect(() => {
    if (form.videoType === "youtube" && form.videoUrl && !form.thumbnailUrl) {
      const thumb = ytThumb(form.videoUrl);
      if (thumb) setForm((f) => ({ ...f, thumbnailUrl: thumb }));
    }
  }, [form.videoUrl, form.videoType]);

  const handleVideoUploaded = (url, name, sizeMB) => {
    setForm((f) => ({ ...f, videoUrl: url, videoType: "upload" }));
  };

  const save = async () => {
    if (!form.title.trim()) { flash("Title is required.", true); return; }
    if (!form.videoUrl.trim()) { flash("Video URL or upload is required.", true); return; }
    setSaving(true);
    try {
      const isEditing = !!(editing && (editing._id || editing.id));
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/lectures/${editing._id || editing.id}` : "/api/lectures";
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
      const body = form;
      const r = await fetch(apiUrl(url), {
        method,
        headers,
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d.success) {
        flash(editing ? "✅ Lecture updated!" : "✅ Lecture added!");
        setForm(EMPTY_FORM);
        setEditing(null);
        setActiveTab("list");
        load();
      } else {
        flash(d.error || "Save failed.", true);
      }
    } catch { flash("Network error.", true); }
    finally { setSaving(false); }
  };

  const startEdit = (lec) => {
    setEditing(lec);
    setForm({ ...EMPTY_FORM, ...lec });
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteLec = async (id) => {
    if (!confirm("Delete this lecture?")) return;
    const headers = { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
    const r = await fetch(apiUrl(`/api/lectures/${id}`), { method: "DELETE", headers });
    const d = await r.json();
    if (d.success) { flash("🗑️ Deleted"); load(); }
  };

  const togglePublic = async (lec) => {
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
    await fetch(apiUrl(`/api/lectures/${lec.id || lec._id}`), {
      method: "PATCH", headers,
      body: JSON.stringify({ isPublic: !lec.isPublic }),
    });
    load();
  };

  const f = (key) => ({
    value: form[key] || "",
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className="space-y-5">
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">{msg}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">⚠️ {error}</div>}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total Lectures", v: lectures.length, c: "from-blue-500 to-blue-600", i: "🎬" },
          { l: "Published", v: lectures.filter(l => l.isPublic).length, c: "from-green-500 to-green-600", i: "✅" },
          { l: "Drafts", v: lectures.filter(l => !l.isPublic).length, c: "from-amber-500 to-amber-600", i: "📝" },
        ].map((s) => (
          <div key={s.l} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`bg-gradient-to-br ${s.c} w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0`}>{s.i}</div>
            <div><div className="text-2xl font-black text-gray-900">{s.v}</div><div className="text-gray-500 text-xs">{s.l}</div></div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("list")} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === "list" ? "bg-[#1e3a8a] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a8a]"}`}>
          📋 All Lectures
        </button>
        <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setActiveTab("add"); }} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === "add" ? "bg-[#1e3a8a] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a8a]"}`}>
          ➕ {editing ? "Edit Lecture" : "Add Lecture"}
        </button>
      </div>

      {/* ── ADD / EDIT FORM ── */}
      {activeTab === "add" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-gray-900">{editing ? "✏️ Edit Lecture" : "➕ Add New Lecture"}</h2>
            {editing && (
              <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setActiveTab("list"); }} className="text-sm text-gray-500 hover:text-gray-700">✕ Cancel Edit</button>
            )}
          </div>
          <div className="p-5 space-y-5">

            {/* Video Source Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Video Source</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {VIDEO_TYPES.map((vt) => (
                  <button key={vt.value} type="button"
                    onClick={() => setForm(f => ({ ...f, videoType: vt.value, videoUrl: vt.value !== form.videoType ? "" : f.videoUrl }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${form.videoType === vt.value ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    <span>{vt.icon}</span> {vt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Upload or URL */}
            {form.videoType === "upload" ? (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Upload Video File</label>
                <VideoUploader onUploaded={handleVideoUploaded} uploadProgress={uploadProgress} setUploadProgress={setUploadProgress} />
                {form.videoUrl && (
                  <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-green-600 text-xs">✅ Uploaded:</span>
                    <a href={form.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline truncate flex-1">{form.videoUrl}</a>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                  {form.videoType === "youtube" ? "YouTube Video URL" : form.videoType === "vimeo" ? "Vimeo Video URL" : "Google Drive Share Link"}
                </label>
                <input
                  type="url" value={form.videoUrl}
                  onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                  placeholder={
                    form.videoType === "youtube" ? "https://www.youtube.com/watch?v=..." :
                    form.videoType === "vimeo" ? "https://vimeo.com/123456789" :
                    "https://drive.google.com/file/d/.../view"
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
                />
                {form.videoType === "youtube" && form.videoUrl && (
                  <p className="text-xs text-gray-400 mt-1">
                    Thumbnail will be auto-generated from YouTube
                  </p>
                )}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Lecture Title *</label>
                <input {...f("title")} placeholder="e.g. Indian History — Mauryan Empire Complete Class" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Course</label>
                <select {...f("course")} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white">
                  {COURSES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Subject</label>
                <select {...f("subject")} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white">
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Instructor</label>
                <input {...f("instructor")} placeholder="Faculty name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Duration</label>
                <input {...f("duration")} placeholder="e.g. 1h 30min or 90 mins" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Description</label>
                <textarea {...f("description")} rows={3} placeholder="Brief description of this lecture..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none resize-none"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Thumbnail URL</label>
                <input {...f("thumbnailUrl")} placeholder="https://... (auto-filled for YouTube)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
              </div>
              <div>
                {form.thumbnailUrl && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Preview</label>
                    <img src={form.thumbnailUrl} alt="thumb" className="w-full h-24 object-cover rounded-xl border" onError={(e) => e.target.style.display="none"}/>
                  </div>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isPublic ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`}/>
                </div>
                <span className="text-sm font-semibold text-gray-700">Published (visible on website)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isFeatured ? "bg-amber-500" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-0.5"}`}/>
                </div>
                <span className="text-sm font-semibold text-gray-700">Featured</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button onClick={save} disabled={saving}
                className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 flex items-center gap-2">
                {saving
                  ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
                  : editing ? "✏️ Update Lecture" : "➕ Add Lecture"}
              </button>
              {editing && (
                <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setActiveTab("list"); }} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── LECTURE LIST ── */}
      {activeTab === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              <input value={filter.q} onChange={(e) => setFilter(f => ({ ...f, q: e.target.value }))}
                placeholder="Search lectures..." className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"/>
              <select value={filter.course} onChange={(e) => setFilter(f => ({ ...f, course: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white">
                <option value="all">All Courses</option>
                {COURSES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={filter.subject} onChange={(e) => setFilter(f => ({ ...f, subject: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white">
                <option value="all">All Subjects</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="flex gap-1">
                <button onClick={() => setView("grid")} className={`p-2 rounded-lg ${view === "grid" ? "bg-[#1e3a8a] text-white" : "bg-gray-100 text-gray-500"}`} title="Grid view">▦</button>
                <button onClick={() => setView("list")} className={`p-2 rounded-lg ${view === "list" ? "bg-[#1e3a8a] text-white" : "bg-gray-100 text-gray-500"}`} title="List view">☰</button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lectures.map((lec) => (
                <div key={lec._id || lec.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] cursor-pointer"
                    onClick={() => setPreview(lec)}>
                    {lec.thumbnailUrl
                      ? <img src={lec.thumbnailUrl} alt={lec.title} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                    }
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-[#1e3a8a] text-xl shadow-lg">▶</div>
                    </div>
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${lec.isPublic ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                        {lec.isPublic ? "Published" : "Draft"}
                      </span>
                      {lec.isFeatured && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white">⭐ Featured</span>}
                    </div>
                    {/* Source badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-black/60 text-white capitalize">
                        {lec.videoType === "upload" ? "☁️ R2" : lec.videoType === "youtube" ? "▶️ YT" : lec.videoType === "drive" ? "📁 Drive" : "🎬"}
                      </span>
                    </div>
                    {lec.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-mono">{lec.duration}</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <div className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{lec.title}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{lec.course}</span>
                      <span>{lec.subject}</span>
                    </div>
                    {lec.instructor && <div className="text-xs text-gray-400 mb-2">👤 {lec.instructor}</div>}
                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      <button onClick={() => startEdit(lec)} className="flex-1 text-xs text-[#1e3a8a] font-bold hover:underline py-1">Edit</button>
                      <button onClick={() => togglePublic(lec)} className={`flex-1 text-xs font-bold py-1 ${lec.isPublic ? "text-amber-600" : "text-green-600"}`}>
                        {lec.isPublic ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => deleteLec(lec._id || lec.id)} className="flex-1 text-xs text-red-500 font-bold hover:underline py-1">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {lectures.length === 0 && (
                <div className="col-span-3 text-center py-16">
                  <div className="text-5xl mb-3">🎬</div>
                  <p className="text-gray-500 font-semibold">No lectures yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click &quot;Add Lecture&quot; to upload your first lecture</p>
                  <button onClick={() => setActiveTab("add")} className="mt-4 bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">➕ Add First Lecture</button>
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Thumbnail", "Title", "Course / Subject", "Instructor", "Duration", "Source", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lectures.map((lec) => (
                    <tr key={lec._id || lec.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setPreview(lec)}>
                          {lec.thumbnailUrl
                            ? <img src={lec.thumbnailUrl} alt="" className="w-full h-full object-cover"/>
                            : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-56">
                        <div className="font-semibold text-gray-900 line-clamp-2 text-xs">{lec.title}</div>
                        {lec.isFeatured && <span className="text-xs text-amber-600">⭐ Featured</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <div className="font-medium">{lec.course}</div>
                        <div className="text-gray-400">{lec.subject}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{lec.instructor || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{lec.duration || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium capitalize">
                          {lec.videoType === "upload" ? "☁️ R2" : lec.videoType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublic(lec)} className={`px-2 py-0.5 text-xs rounded-full font-semibold ${lec.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {lec.isPublic ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <button onClick={() => setPreview(lec)} className="text-blue-500 text-xs font-bold hover:underline" title="Preview">▶️</button>
                          <button onClick={() => startEdit(lec)} className="text-[#1e3a8a] text-xs font-bold hover:underline">Edit</button>
                          <button onClick={() => deleteLec(lec._id || lec.id)} className="text-red-500 text-xs font-bold hover:underline">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lectures.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-gray-400 text-sm">No lectures found. Use filters above or add a new lecture.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── VIDEO PREVIEW MODAL ── */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-gray-900 text-base line-clamp-2">{preview.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{preview.course}</span>
                  <span className="text-xs text-gray-400">{preview.subject}</span>
                  {preview.instructor && <span className="text-xs text-gray-400">👤 {preview.instructor}</span>}
                  {preview.duration && <span className="text-xs text-gray-400 font-mono">⏱ {preview.duration}</span>}
                </div>
              </div>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-700 text-2xl shrink-0 leading-none">✕</button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black">
              {preview.videoType === "upload" ? (
                <video src={preview.videoUrl} controls className="w-full h-full" controlsList="nodownload">
                  Your browser does not support video playback.
                </video>
              ) : (
                <iframe
                  src={toEmbedUrl(preview.videoUrl, preview.videoType)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={preview.title}
                />
              )}
            </div>

            {/* Description */}
            {preview.description && (
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">{preview.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
