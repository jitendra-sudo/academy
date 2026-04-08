"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = ["All", "Classroom", "Toppers", "Events", "Interviews", "Online", "Study"];

const galleryItems = [
  {
    id: 1,
    category: "Classroom",
    title: "UPSC Foundation Batch 2025",
    desc: "Our state-of-the-art classroom with 200+ students attending the foundation lecture.",
    event: "Regular Batch",
    date: "Jan 2025",
    bg: "from-blue-900 to-blue-700",
    emoji: "🏫",
    tag: "Foundation",
  },
  {
    id: 2,
    category: "Toppers",
    title: "UPSC CSE 2025 Toppers Felicitation",
    desc: "Celebrating 202 selections from our academy in UPSC CSE 2025 results.",
    event: "Felicitation Ceremony",
    date: "Jul 2025",
    bg: "from-amber-700 to-amber-500",
    emoji: "🏆",
    tag: "AIR 02",
  },
  {
    id: 3,
    category: "Interviews",
    title: "Civil Services Mock Interview 2025",
    desc: "Panel-based mock interview session to prepare students for UPSC personality test.",
    event: "Interview Programme",
    date: "Mar 2025",
    bg: "from-slate-800 to-slate-600",
    emoji: "🎙️",
    tag: "IPS Mock",
  },
  {
    id: 4,
    category: "Study",
    title: "Group Study Sessions",
    desc: "Students collaborating on current affairs and answer writing in our library.",
    event: "Study Circle",
    date: "Feb 2025",
    bg: "from-green-800 to-green-600",
    emoji: "📚",
    tag: "Current Affairs",
  },
  {
    id: 5,
    category: "Events",
    title: "Manasarovar Branch Inauguration 2025",
    desc: "Grand inauguration of Mentors Merits Academy's new branch with dignitaries.",
    event: "Inauguration Day",
    date: "Jan 2025",
    bg: "from-purple-900 to-purple-700",
    emoji: "🎊",
    tag: "New Branch",
  },
  {
    id: 6,
    category: "Online",
    title: "Live UPSC Online Classes",
    desc: "Two-way live sessions connecting students across India with expert faculty.",
    event: "Online Learning",
    date: "Ongoing",
    bg: "from-cyan-800 to-cyan-600",
    emoji: "💻",
    tag: "Live Class",
  },
  {
    id: 7,
    category: "Toppers",
    title: "TNPSC Toppers Felicitation 2025",
    desc: "Felicitating our 47 successful candidates in TNPSC Group I Results 2024.",
    event: "TNPSC Ceremony",
    date: "Mar 2025",
    bg: "from-rose-800 to-rose-600",
    emoji: "⭐",
    tag: "Group I",
  },
  {
    id: 8,
    category: "Events",
    title: "20 Years Celebration – 2024",
    desc: "A milestone celebration of 20 years of excellence in civil services coaching.",
    event: "Anniversary",
    date: "Nov 2024",
    bg: "from-indigo-900 to-indigo-700",
    emoji: "🎂",
    tag: "20 Years",
  },
  {
    id: 9,
    category: "Classroom",
    title: "UPSC Optional Batch – Geography",
    desc: "Specialized Geography optional coaching with detailed map work and case studies.",
    event: "Optional Programme",
    date: "Apr 2025",
    bg: "from-teal-800 to-teal-600",
    emoji: "🗺️",
    tag: "Geography",
  },
  {
    id: 10,
    category: "Interviews",
    title: "Forest Service Interview Guidance",
    desc: "IFS mock interview coaching with expert forest officers on the panel.",
    event: "IFS Interview",
    date: "Sep 2024",
    bg: "from-green-900 to-emerald-700",
    emoji: "🌳",
    tag: "IFS",
  },
  {
    id: 11,
    category: "Events",
    title: "Teachers Day Celebration 2025",
    desc: "Students honour their mentors on Teachers Day across all branches.",
    event: "Teachers Day",
    date: "Sep 2025",
    bg: "from-pink-800 to-pink-600",
    emoji: "👨‍🏫",
    tag: "Faculty",
  },
  {
    id: 12,
    category: "Study",
    title: "Answer Writing Workshop",
    desc: "Intensive GS Mains answer writing practice with expert feedback and evaluation.",
    event: "Mains Workshop",
    date: "Jun 2025",
    bg: "from-orange-800 to-orange-600",
    emoji: "✍️",
    tag: "Mains",
  },
];

const highlights = [
  { icon: "🏆", value: "202", label: "UPSC CSE 2025 Selections" },
  { icon: "⭐", value: "47", label: "TNPSC Group I 2024" },
  { icon: "📸", value: "500+", label: "Events Captured" },
  { icon: "🎓", value: "20+", label: "Years of Journey" },
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            📸 UPSC Coaching Gallery
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Our Journey in <span className="text-amber-400">Pictures</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">
            From classrooms to felicitation stages — witness the dedication, hard work, and triumphs of
            our students at Mentors Merits Academy.
          </p>

          {/* Highlight Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((h) => (
              <div key={h.label} className="glass rounded-2xl p-4">
                <div className="text-2xl mb-1">{h.icon}</div>
                <div className="text-amber-400 text-2xl font-black">{h.value}</div>
                <div className="text-blue-200 text-xs">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#1e3a8a] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-[#1e3a8a]"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className={`ml-1.5 text-xs ${activeCategory === cat ? "text-blue-200" : "text-gray-400"}`}>
                  ({galleryItems.filter((g) => g.category === cat).length})
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-sm text-gray-400">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                id={`gallery-item-${item.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                {/* Image Placeholder with gradient */}
                <div className={`relative h-48 bg-gradient-to-br ${item.bg} flex items-center justify-center overflow-hidden`}>
                  <span className="text-6xl opacity-40 group-hover:scale-125 transition-transform duration-500">
                    {item.emoji}
                  </span>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  {/* Tag */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30">
                      {item.tag}
                    </span>
                  </div>
                  {/* Category badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#1e3a8a] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#1e3a8a] font-medium">{item.event}</span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500">No gallery items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Be Part of Our Success Story
          </h2>
          <p className="text-blue-200 mb-6">
            Join thousands of UPSC aspirants who have transformed their lives at Mentors Merits Academy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#admission"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:scale-105"
            >
              Enquire Now →
            </Link>
            <Link
              href="/#achievements"
              className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              View Achievers
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image area */}
            <div className={`h-64 bg-gradient-to-br ${lightbox.bg} flex items-center justify-center relative`}>
              <span className="text-8xl opacity-50">{lightbox.emoji}</span>
              <div className="absolute top-4 right-4">
                <button
                  id="lightbox-close-btn"
                  onClick={() => setLightbox(null)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full">{lightbox.category}</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">{lightbox.tag}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{lightbox.title}</h3>
                  <p className="text-[#1e3a8a] text-sm font-semibold">{lightbox.event} · {lightbox.date}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-5">{lightbox.desc}</p>
              <div className="flex gap-3">
                <Link
                  href="/#admission"
                  className="flex-1 text-center bg-[#1e3a8a] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#1d4ed8] transition-colors"
                  onClick={() => setLightbox(null)}
                >
                  Enquire Now
                </Link>
                <button
                  onClick={() => setLightbox(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
