"use client";
import { useState, useRef } from "react";
import { apiUrl } from "@/lib/api";

// Reusable drag-and-drop image uploader that uploads to R2 via /api/upload
// Props:
//   label        - field label
//   currentUrl   - current image URL to preview
//   folder       - R2 subfolder (logo|banner|gallery|general)
//   onUploaded   - callback(url) when upload succeeds
//   hint         - optional helper text
//   aspectHint   - optional aspect ratio hint e.g. "16:9 recommended"

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

    // Local preview immediately
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
        // Still keep local preview and pass blob URL as fallback
        onUploaded?.(""); // clear
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
    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5MB."); return; }
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
            <div className="flex flex-col items-center gap-2 py-2">
              <svg className="w-6 h-6 animate-spin text-[#1e3a8a]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="text-xs text-gray-500">Uploading to R2...</span>
            </div>
          ) : (
            <div className="py-2">
              <div className="text-2xl mb-1">☁️</div>
              <p className="text-xs text-gray-500 font-medium">Click or drag image here</p>
              <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP, SVG · Max 5MB</p>
            </div>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="shrink-0 relative">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
              onError={() => setPreview("")}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(""); onUploaded?.(""); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
              title="Remove image"
            >✕</button>
          </div>
        )}
      </div>

      {/* Status messages */}
      {success && <p className="text-green-600 text-xs mt-1.5 font-medium">✅ {success}</p>}
      {error && (
        <div className="mt-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          ⚠️ {error}
          {error.includes("R2 not configured") && (
            <a href="#r2-setup" className="ml-2 underline font-semibold">View setup guide ↓</a>
          )}
        </div>
      )}

      {/* Show current URL if exists */}
      {preview && !preview.startsWith("data:") && (
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-xs text-gray-400 truncate flex-1">{preview}</span>
          <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-[#1e3a8a] hover:underline shrink-0">Open ↗</a>
        </div>
      )}

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
