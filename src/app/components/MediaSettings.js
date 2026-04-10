"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import ImageUploader from "./ImageUploader";

// SectionCard wrapper
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
    // Check R2 config status
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
      {/* R2 Status Banner */}
      {r2Status !== null && (
        <div className={`rounded-2xl p-4 border ${r2Status.r2Configured ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{r2Status.r2Configured ? "✅" : "⚠️"}</span>
            <div>
              <div className="font-bold text-sm text-gray-900">
                Cloudflare R2 — {r2Status.r2Configured ? "Connected" : "Not Configured"}
              </div>
              {r2Status.r2Configured ? (
                <p className="text-green-700 text-xs mt-0.5">Bucket: <strong>{r2Status.bucket}</strong> · Images will be stored at: {r2Status.publicUrl}</p>
              ) : (
                <div className="text-amber-700 text-xs mt-1 space-y-1">
                  <p>Add these to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file to enable image uploads:</p>
                  <div className="bg-amber-100 rounded-lg p-2 font-mono text-xs space-y-0.5">
                    <div>R2_ACCOUNT_ID=<span className="text-amber-800">your-account-id</span></div>
                    <div>R2_ACCESS_KEY_ID=<span className="text-amber-800">your-access-key</span></div>
                    <div>R2_SECRET_ACCESS_KEY=<span className="text-amber-800">your-secret-key</span></div>
                    <div>R2_BUCKET_NAME=<span className="text-amber-800">mentor-merits-assets</span></div>
                    <div>NEXT_PUBLIC_R2_PUBLIC_URL=<span className="text-amber-800">https://your-bucket-url</span></div>
                  </div>
                  <p>Get these from: <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="font-semibold underline">Cloudflare Dashboard → R2 → API Tokens</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logo & Favicon */}
      <SectionCard title="Logo & Favicon" icon="🏛️" onSave={saveImages} saving={saving} saved={saved}>
        <div className="grid md:grid-cols-2 gap-6">
          <ImageUploader
            label="Academy Logo"
            currentUrl={images.logoUrl}
            folder="logo"
            onUploaded={setImg("logoUrl")}
            aspectHint="Square image recommended (1:1) · PNG/SVG with transparent background"
            hint="Displayed in the navbar, footer, and admin panel"
          />
          <ImageUploader
            label="Favicon"
            currentUrl={images.faviconUrl}
            folder="logo"
            onUploaded={setImg("faviconUrl")}
            aspectHint="Square 32×32 or 64×64 PNG/ICO"
            hint="Small icon shown in browser tab"
          />
        </div>
        {/* Current logo URL inputs for manual entry */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Logo URL (manual)</label>
            <input value={images.logoUrl || ""} onChange={e => setImages(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Favicon URL (manual)</label>
            <input value={images.faviconUrl || ""} onChange={e => setImages(prev => ({ ...prev, faviconUrl: e.target.value }))}
              placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
          </div>
        </div>
      </SectionCard>

      {/* Hero Banner */}
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

      {/* About & SEO */}
      <SectionCard title="About & SEO Images" icon="🔍">
        <div className="grid md:grid-cols-2 gap-6">
          <ImageUploader
            label="About Section Image"
            currentUrl={images.aboutImageUrl}
            folder="general"
            onUploaded={setImg("aboutImageUrl")}
            aspectHint="4:3 or 1:1 — 800×600px recommended"
            hint="Image shown in the About Us section"
          />
          <ImageUploader
            label="OG / Social Share Image"
            currentUrl={images.ogImageUrl}
            folder="general"
            onUploaded={setImg("ogImageUrl")}
            aspectHint="1200×630px — shown when sharing on WhatsApp/Facebook"
            hint="Shown when the website is shared on social media"
          />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-4">
          {[["aboutImageUrl", "About Image URL"], ["ogImageUrl", "OG Image URL"]].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{label}</label>
              <input value={images[key] || ""} onChange={e => setImages(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={saveImages} disabled={saving}
            className="bg-[#1e3a8a] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8]">
            {saving ? "Saving..." : "Save Images"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
