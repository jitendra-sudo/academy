"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import ImageUploader from "./ImageUploader";

function SectionCard({ title, icon, children, onSave, saving, saved }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-black text-gray-900 flex items-center gap-2">{icon} {title}</h2>
        {onSave && (
          <button onClick={onSave} disabled={saving}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${saved ? "bg-green-500 text-white" : "bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white"} disabled:opacity-60`}>
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function MediaSettings({ settings, onSettingsChange }) {
  const [images, setImages] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [r2Status, setR2Status] = useState(null);

  useEffect(() => {
    if (settings?.images) setImages({ ...settings.images });
    fetch(apiUrl("/api/upload")).then(r => r.json()).then(d => setR2Status(d));
  }, [settings]);

  const saveImages = async () => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl("/api/settings"), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
        body: JSON.stringify({ section: "images", data: images }),
      });
      const d = await res.json();
      if (d.success) { onSettingsChange?.(d.data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  const setImg = (key) => (url) => setImages(prev => ({ ...prev, [key]: url }));

  return (
    <div className="space-y-5">
   
      <SectionCard title="Hero Banners" icon="🖼️">
        <div className="grid md:grid-cols-2 gap-6">
          <ImageUploader
            label="Hero Banner 1 (Main)"
            currentUrl={images.heroBannerUrl}
            folder="banner"
            onUploaded={setImg("heroBannerUrl")}
            aspectHint="16:9 or wider — 1920×600px recommended"
            hint="Main hero slide on the homepage"
          />
          <ImageUploader
            label="Hero Banner 2"
            currentUrl={images.heroBanner2Url}
            folder="banner"
            onUploaded={setImg("heroBanner2Url")}
            aspectHint="16:9 or wider — 1920×600px recommended"
            hint="Second hero slide (optional)"
          />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            {[["heroBannerUrl", "Hero Banner 1 URL"], ["heroBanner2Url", "Hero Banner 2 URL"]].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{label}</label>
                <input value={images[key] || ""} onChange={e => setImages(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={saveImages} disabled={saving}
            className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Banners"}
          </button>
        </div>
      </SectionCard>

    </div>
  );
}
