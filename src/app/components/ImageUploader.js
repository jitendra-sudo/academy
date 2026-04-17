import { useState, useRef } from "react";
import { apiUrl } from "@/lib/api";
import { CloudUpload, CheckCircle2, AlertTriangle, X, ExternalLink, Loader2 } from "lucide-react";

export default function ImageUploader({ label, currentUrl, folder = "general", onUploaded, hint, aspectHint }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef();

  const upload = async (file) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const headers = { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };
      const res = await fetch(apiUrl("/api/upload"), { method: "POST", headers, body: form });
      const data = await res.json();

      if (data.success) {
        setPreview(data.url);
        setSuccess("Uploaded successfully!");
        onUploaded?.(data.url);
        setTimeout(() => setSuccess(""), 4000);
      } else if (data.setupRequired) {
        setError("R2 not configured yet. See setup instructions below.");
        onUploaded?.(""); 
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowed.includes(file.type)) { setError("Please upload a JPEG, PNG, WebP, GIF, or SVG file."); return; }
    upload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</label>}
      {aspectHint && <p className="text-xs text-gray-400 mb-2">{aspectHint}</p>}

      <div className="flex gap-4 items-start">
        {/* Drop zone */}
        <div
          className={`flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${dragging ? "border-[#1e3a8a] bg-blue-50" : "border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50/50"}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
              <span className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest">Uploading to R2...</span>
            </div>
          ) : (
            <div className="py-2">
              <div className="flex justify-center mb-2 text-gray-300 group-hover:text-[#1e3a8a] transition-colors">
                <CloudUpload size={32} />
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Click or drag image here</p>
              <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP, SVG · Max 5MB</p>
            </div>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="shrink-0 relative group/preview">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100 shadow-sm transition-all group-hover/preview:border-[#1e3a8a]"
              onError={() => setPreview("")}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(""); onUploaded?.(""); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 shadow-lg border-2 border-white transition-all hover:scale-110"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Status messages */}
      {success && <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5"><CheckCircle2 size={12} /> {success}</p>}
      {error && (
        <div className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 flex items-start gap-2 shadow-sm font-medium">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <div>
            {error}
            {error.includes("R2 not configured") && (
              <a href="#r2-setup" className="ml-2 underline font-bold text-red-700">View setup guide ↓</a>
            )}
          </div>
        </div>
      )}

      {/* Show current URL if exists */}
      {preview && !preview.startsWith("data:") && (
        <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
          <span className="text-[10px] text-gray-400 font-mono truncate flex-1 uppercase tracking-tighter">{preview}</span>
          <a href={preview} target="_blank" rel="noreferrer" className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-wider hover:underline shrink-0 flex items-center gap-1">
            Open <ExternalLink size={10} />
          </a>
        </div>
      )}

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
