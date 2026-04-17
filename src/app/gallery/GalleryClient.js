"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiUrl } from "@/lib/api";
import { 
  Trophy, 
  Star, 
  Camera, 
  GraduationCap, 
  Image as ImageIcon, 
  Search, 
  ZoomIn, 
  ArrowRight, 
  ChevronRight,
  X
} from "lucide-react";

const categories = ["All", "Classroom", "Toppers", "Events", "Interviews", "Online", "Study"];

const highlights = [
  { icon: <Trophy size={20} className="text-amber-400" />, value: "202", label: "UPSC CSE 2025 Selections" },
  { icon: <Star size={20} className="text-amber-400" />, value: "47", label: "TNPSC Group I 2024" },
  { icon: <Camera size={20} className="text-amber-400" />, value: "500+", label: "Events Captured" },
  { icon: <GraduationCap size={20} className="text-amber-400" />, value: "10+", label: "Years of Journey" },
];

// Skeleton card
function GallerySkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// Map API item shape → display shape
const BG_POOL = [
  "from-blue-900 to-blue-700",
  "from-amber-700 to-amber-500",
  "from-slate-800 to-slate-600",
  "from-green-800 to-green-600",
  "from-purple-900 to-purple-700",
  "from-cyan-800 to-cyan-600",
  "from-rose-800 to-rose-600",
  "from-indigo-900 to-indigo-700",
  "from-teal-800 to-teal-600",
  "from-green-900 to-emerald-700",
  "from-pink-800 to-pink-600",
  "from-orange-800 to-orange-600",
];

function mapItem(item, idx) {
  return {
    id: item._id || item.id,
    category: item.category || "Events",
    title: item.title || "",
    desc: item.desc || item.description || "",
    event: item.event || "",
    date: item.date || "",
    bg: item.bg || BG_POOL[idx % BG_POOL.length],
    emoji: item.emoji || "📸",
    tag: item.tag || item.category || "",
    imageUrl: item.imageUrl || null,
  };
}

export default function GalleryClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/gallery"))
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length) {
          setItems(d.data.map(mapItem));
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((g) => g.category === activeCategory);

  // counts per category
  const countFor = (cat) => items.filter((g) => g.category === cat).length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] py-24 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Camera size={14} className="opacity-80" /> UPSC Coaching Gallery
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Our Legacy in <span className="text-amber-400 italic">Frames</span>
          </h1>
          <p className="text-blue-100/70 text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Witness the transformative journey of our civil service aspirants — from focused 
            study sessions to the final glory of felicitation.
          </p>

          {/* Highlight Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {highlights.map((h, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-6 group hover:bg-white/10 transition-all duration-300">
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">{h.icon}</div>
                <div className="text-white text-3xl font-black mb-1">{h.value}</div>
                <div className="text-blue-200/60 text-[10px] uppercase font-bold tracking-widest leading-tight">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${activeCategory === cat
                  ? "bg-[#1e3a8a] text-white shadow-xl -translate-y-0.5"
                  : "bg-gray-50 text-gray-500 hover:bg-white hover:text-[#1e3a8a] border border-transparent hover:border-gray-200"
                }`}
            >
              {cat}
              {cat !== "All" && countFor(cat) > 0 && (
                <span className={`ml-2 opacity-50 ${activeCategory === cat ? "text-white" : "text-gray-400"}`}>
                  {countFor(cat)}
                </span>
              )}
            </button>
          ))}
          {!loading && (
            <div className="ml-auto shrink-0 bg-blue-50 text-[#1e3a8a] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter">
              {filtered.length} Items
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gray-50/50 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => <GallerySkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
               <div className="flex justify-center mb-6 text-gray-200">
                <ImageIcon size={64} strokeWidth={1} />
              </div>
              <p className="text-xl font-black text-gray-700 mb-2">
                {items.length === 0 ? "Gallery Archive is Empty" : "No Matches in this Category"}
              </p>
              <p className="text-gray-400 text-sm font-medium">Resources are being digitized and will appear here shortly.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100/80 hover:shadow-2xl hoverShadow-blue transition-all duration-500 cursor-pointer"
                  onClick={() => setLightbox(item)}
                >
                  {/* Image or gradient */}
                  <div className={`relative h-56 bg-gradient-to-br ${item.bg} flex items-center justify-center overflow-hidden`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="text-white/20 group-hover:rotate-12 transition-transform duration-500">
                        <ImageIcon size={64} strokeWidth={1} />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#1e3a8a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                      <div className="bg-white text-[#1e3a8a] rounded-full p-4 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn size={24} />
                      </div>
                    </div>
                    {/* Tag */}
                    {item.tag && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                          {item.tag}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#1e3a8a] transition-colors duration-300 mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                      <span className="text-[10px] text-[#1e3a8a] font-black uppercase tracking-wider">{item.event}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 blur-[150px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-1 leading-tight">Join the Academy</h2>
          <p className="text-[#1e3a8a] font-bold text-sm tracking-[0.2em] mb-8 uppercase">Start Your Personalized Mentorship Path</p>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto font-medium leading-relaxed">Our clinical preparation methodology transforms determined aspirants into successful civil servants.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#admission" className="shimmer-btn text-white px-10 py-4.5 rounded-[1.5rem] font-black text-sm transition-all hoverShadow-blue hover:-translate-y-1 flex items-center gap-3">
              Book Admission Counseling <ArrowRight size={20} />
            </Link>
            <Link href="/#achievements" className="bg-white border-2 border-gray-100 text-gray-600 hover:border-amber-400 hover:text-amber-500 px-10 py-4.5 rounded-[1.5rem] font-black text-sm transition-all hover:-translate-y-1">
              Hall of Fame
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-8" onClick={() => setLightbox(null)}>
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all z-[110]"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          
          <div className="bg-white rounded-[3rem] overflow-hidden max-w-4xl w-full shadow-2xl animate-fade-up relative" onClick={(e) => e.stopPropagation()}>
            {/* Image area */}
            <div className={`aspect-[16/10] md:aspect-video bg-gradient-to-br ${lightbox.bg} flex items-center justify-center relative overflow-hidden`}>
              {lightbox.imageUrl ? (
                <img src={lightbox.imageUrl} alt={lightbox.title} className="w-full h-full object-contain" />
              ) : (
                <div className="text-white/20">
                  <ImageIcon size={120} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-[#1e3a8a]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl">
                  {lightbox.category}
                </span>
                {lightbox.tag && (
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl">
                    {lightbox.tag}
                  </span>
                )}
              </div>
            </div>
            {/* Info */}
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                   <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{lightbox.title}</h3>
                   <p className="text-[#1e3a8a] font-bold text-sm tracking-widest mt-2 uppercase">{lightbox.event}{lightbox.event && lightbox.date ? " · " : ""}{lightbox.date}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Link href="/#admission" onClick={() => setLightbox(null)}
                      className="flex-1 md:flex-none px-8 py-3.5 bg-[#1e3a8a] text-white rounded-2xl font-black text-sm hover:bg-[#1d4ed8] shadow-lg transition-all text-center">
                      Join the Batch
                    </Link>
                    <button onClick={() => setLightbox(null)}
                      className="flex-1 md:flex-none px-8 py-3.5 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all text-center">
                      Close View
                    </button>
                </div>
              </div>
              {lightbox.desc && <p className="text-gray-500 leading-relaxed font-medium text-base border-t border-gray-50 pt-6">{lightbox.desc}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
