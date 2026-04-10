"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

// Helper: convert any video URL to embed URL
function toEmbedUrl(url, type) {
  if (type === "youtube") {
    const match = url?.match(/(?:v=|youtu\.be\/|embed\/)([^&\s?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&autoplay=1` : url;
  }
  if (type === "vimeo") {
    const match = url?.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : url;
  }
  if (type === "drive") {
    const match = url?.match(/\/file\/d\/([^/]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
  }
  return url;
}

const COURSES = ["All", "UPSC CSE", "UPSC IFS", "TNPSC Group I", "TNPSC Group II", "Banking / SSC", "Others"];
const SUBJECTS = ["All", "History", "Geography", "Polity", "Economy", "Environment", "Science & Tech", "Current Affairs", "Ethics", "Essay", "Others"];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

function LectureCard({ lecture, onPlay }) {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onPlay(lecture)}
    >
      <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] overflow-hidden">
        {lecture.thumbnailUrl ? (
          <img
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎬</div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center text-[#1e3a8a] shadow-2xl">
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-[#1e3a8a]/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {lecture.course}
          </span>
          {lecture.isFeatured && (
            <span className="bg-amber-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {lecture.duration && (
            <span className="bg-black/70 backdrop-blur text-white text-xs font-mono px-2 py-0.5 rounded-full">
              ⏱ {lecture.duration}
            </span>
          )}
          <span className="bg-black/70 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full capitalize">
            {lecture.videoType === "upload" ? "☁️ HD" : lecture.videoType === "youtube" ? "▶️ YT" : lecture.videoType === "drive" ? "📁" : "🎬"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#1e3a8a] transition-colors">
          {lecture.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{lecture.subject}</span>
        </div>
        {lecture.instructor && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-5 h-5 bg-gradient-to-br from-[#1e3a8a] to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {lecture.instructor[0]?.toUpperCase()}
            </div>
            <span>{lecture.instructor}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoModal({ lecture, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!lecture) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h2 className="font-black text-gray-900 text-lg leading-snug line-clamp-2">{lecture.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{lecture.course}</span>
              <span className="text-gray-400 text-xs">{lecture.subject}</span>
              {lecture.instructor && <span className="text-gray-400 text-xs">👤 {lecture.instructor}</span>}
              {lecture.duration && <span className="text-gray-400 text-xs font-mono">⏱ {lecture.duration}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-all shrink-0 text-xl leading-none"
            aria-label="Close"
          >✕</button>
        </div>
        <div className="aspect-video bg-black">
          {lecture.videoType === "upload" ? (
            <video src={lecture.videoUrl} controls autoPlay className="w-full h-full" controlsList="nodownload">
              Your browser does not support video playback.
            </video>
          ) : (
            <iframe
              src={toEmbedUrl(lecture.videoUrl, lecture.videoType)}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={lecture.title}
            />
          )}
        </div>
        {lecture.description && (
          <div className="p-5 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">{lecture.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState("All");
  const [activeSubject, setActiveSubject] = useState("All");
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState(null);
  const [whatsapp, setWhatsapp] = useState("+917397236970");

  // Fetch contact settings for WhatsApp number
  useEffect(() => {
    fetch(apiUrl("/api/settings"))
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.contact?.whatsapp) {
          setWhatsapp(d.data.contact.whatsapp);
        }
      })
      .catch(() => { });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ isPublic: "true" });
      if (activeCourse !== "All") p.set("course", activeCourse);
      if (activeSubject !== "All") p.set("subject", activeSubject);
      if (search) p.set("q", search);
      const r = await fetch(apiUrl("/api/lectures?" + p.toString()));
      const d = await r.json();
      if (d.success) setLectures(d.data);
    } catch {
      // ignore network errors
    } finally {
      setLoading(false);
    }
  }, [activeCourse, activeSubject, search]);

  useEffect(() => { load(); }, [load]);

  const featured = lectures.filter((l) => l.isFeatured).slice(0, 3);
  const allVisible = lectures;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] py-20 pt-28 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="text-xl">🎬</span>
              <span className="text-white/90 text-sm font-semibold">Free Lecture Library</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Learn From India&apos;s <br />
              <span className="text-amber-400">Best UPSC Faculty</span>
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
              Access free video lectures on History, Geography, Polity, Economy, Current Affairs, Ethics, and more — curated by Mentor Merits Academy.
            </p>
            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lectures, subjects, topics..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl text-sm"
              />
            </div>
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {[
                { label: "Total Lectures", value: lectures.length + "+" },
                { label: "Subjects Covered", value: "15+" },
                { label: "Expert Faculty", value: "20+" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-amber-400">{s.value}</div>
                  <div className="text-blue-200 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          {/* Featured Lectures */}
          {featured.length > 0 && !search && activeCourse === "All" && activeSubject === "All" && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">⭐</span>
                <h2 className="text-2xl font-black text-gray-900">Featured Lectures</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featured.map((lec) => (
                  <LectureCard key={lec._id || lec.id} lecture={lec} onPlay={setPlaying} />
                ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Filter by Course</p>
                <div className="flex flex-wrap gap-2">
                  {COURSES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCourse(c)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCourse === c
                          ? "bg-[#1e3a8a] text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Filter by Subject</p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSubject(s)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeSubject === s
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-amber-300"
                        }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-gray-900 text-xl">
              {search ? `Search results for "${search}"` : activeCourse === "All" ? "All Lectures" : `${activeCourse} Lectures`}
            </h2>
            {!loading && <span className="text-gray-400 text-sm">{allVisible.length} lecture{allVisible.length !== 1 ? "s" : ""}</span>}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : allVisible.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-black text-gray-700 mb-2">No lectures found</h3>
              <p className="text-gray-400 mb-6">
                {search ? `No results for "${search}".` : "No lectures available for the selected filters."}
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCourse("All"); setActiveSubject("All"); }}
                className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allVisible.map((lec) => (
                <LectureCard key={lec._id || lec.id} lecture={lec} onPlay={setPlaying} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl font-black mb-2">Want Personalized Guidance?</h2>
            <p className="text-blue-200 mb-6">Join thousands of students achieving their UPSC dreams with Mentor Merits Academy.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/#admission" className="bg-amber-500 hover:bg-amber-400 text-[#0f172a] font-black px-6 py-3 rounded-xl transition-all hover:shadow-lg">
                Apply for Admission →
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Talk to Counsellor
              </a>
            </div>
          </div>
        </div>
      </main>

      <VideoModal lecture={playing} onClose={() => setPlaying(null)} />

      <footer className="bg-[#0f172a] text-white py-8 text-center text-sm">
        <p className="text-gray-400">© 2026 Mentor Merits Academy. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">Home</Link>
          <Link href="/gallery" className="text-gray-500 hover:text-white transition-colors">Gallery</Link>
          <Link href="/lectures" className="text-amber-400 font-semibold">Lectures</Link>
        </div>
      </footer>
    </>
  );
}
