"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { 
  Play, 
  Clock, 
  Search, 
  Video, 
  ArrowRight, 
  User, 
  X, 
  Star, 
  Search as SearchIcon,
  PlayCircle
} from "lucide-react";

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
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hoverShadow-blue transition-all duration-500 cursor-pointer"
      onClick={() => onPlay(lecture)}
    >
      <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] overflow-hidden">
        {lecture.thumbnailUrl ? (
          <img
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Video size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-[#1e3a8a]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white text-[#1e3a8a] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-[#1e3a8a]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
            {lecture.course}
          </span>
          {lecture.isFeatured && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {lecture.duration && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
              <Clock size={10} /> {lecture.duration}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#1e3a8a] transition-colors duration-300">
          {lecture.title}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-50 text-[#1e3a8a] text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{lecture.subject}</span>
        </div>
        {lecture.instructor && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-6 h-6 bg-gradient-to-br from-[#1e3a8a] to-blue-400 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0">
              {lecture.instructor[0]?.toUpperCase()}
            </div>
            <span className="font-medium">{lecture.instructor}</span>
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
        className="bg-white rounded-[2.5rem] overflow-hidden w-full max-w-4xl shadow-2xl transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-gray-100">
          <div className="flex-1 pr-8">
            <h2 className="font-black text-gray-900 text-xl leading-snug line-clamp-2">{lecture.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="bg-blue-50 text-[#1e3a8a] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">{lecture.course}</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-tight">{lecture.subject}</span>
              {lecture.instructor && <span className="text-gray-400 text-xs flex items-center gap-1.5"><User size={14} /> {lecture.instructor}</span>}
              {lecture.duration && <span className="text-gray-400 text-xs flex items-center gap-1.5 font-mono"><Clock size={14} /> {lecture.duration}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
            aria-label="Close"
          ><X size={20} /></button>
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
          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{lecture.description}</p>
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
        <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] py-24 pt-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
              <Video size={16} fill="white" className="opacity-80" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Free Lecture Library</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Master the UPSC <br />
              <span className="text-amber-400">Expert Lectures</span>
            </h1>
            <p className="text-blue-100/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock professional insights across all core subjects. Quality preparation 
              now accessible for every dedicated aspirant.
            </p>
            {/* Search */}
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1e3a8a] group-focus-within:scale-110 transition-transform">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lectures, topics, or faculty..."
                className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transition-all"
              />
            </div>
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mt-12 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] max-w-2xl mx-auto">
              {[
                { label: "Free Lectures", value: lectures.length + "+" },
                { label: "Core Subjects", value: "15+" },
                { label: "Expert Faculty", value: "10+" },
              ].map((s) => (
                <div key={s.label} className="text-center group">
                  <div className="text-3xl font-black text-amber-400 group-hover:scale-110 transition-transform">{s.value}</div>
                  <div className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Featured Lectures */}
          {featured.length > 0 && !search && activeCourse === "All" && activeSubject === "All" && (
            <section className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-400/20 rounded-2xl text-amber-500">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Handpicked Features</h2>
                  <p className="text-gray-400 text-sm font-medium">Top-rated sessions for high-yield preparation</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {featured.map((lec) => (
                  <LectureCard key={lec._id || lec.id} lecture={lec} onPlay={setPlaying} />
                ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-12">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-[#1e3a8a]/40 uppercase tracking-[0.2em] mb-4">Course Stream</p>
                <div className="flex flex-wrap gap-2.5">
                  {COURSES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCourse(c)}
                      className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeCourse === c
                          ? "bg-[#1e3a8a] text-white shadow-xl -translate-y-0.5"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#1e3a8a]/40 uppercase tracking-[0.2em] mb-4">Subject Focus</p>
                <div className="flex flex-wrap gap-2.5">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSubject(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeSubject === s
                          ? "bg-amber-500 text-white shadow-xl -translate-y-0.5"
                          : "bg-white border-2 border-gray-100 text-gray-500 hover:border-amber-300"
                        }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="font-black text-gray-900 text-2xl tracking-tight">
              {search ? search : activeCourse === "All" ? "Full Library" : activeCourse} 
              <span className="text-[#1e3a8a] ml-1">Lectures</span>
            </h2>
            {!loading && (
              <div className="px-3 py-1 bg-blue-50 text-[#1e3a8a] rounded-lg text-xs font-black uppercase tracking-tighter">
                {allVisible.length} Found
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : allVisible.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="flex justify-center mb-6 text-gray-200">
                <Video size={64} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">No Matching Lectures</h3>
              <p className="text-gray-400 mb-8 font-medium">
                Try clinical search terms or adjust your filters.
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCourse("All"); setActiveSubject("All"); }}
                className="bg-[#1e3a8a] text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-[#1d4ed8] shadow-lg transition-all active:scale-95"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {allVisible.map((lec) => (
                <LectureCard key={lec._id || lec.id} lecture={lec} onPlay={setPlaying} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-24 relative">
             <div className="absolute inset-0 bg-blue-600 blur-[120px] opacity-20" />
             <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Video size={120} strokeWidth={1} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Join Our Mentorship <br /> Programmes Today</h2>
                <p className="text-blue-100/70 text-lg mb-10 max-w-xl mx-auto font-medium">Standardize your preparation with India&apos;s most student-focused ecosystem.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="/#admission" className="shimmer-btn bg-amber-500 text-white font-black px-10 py-4.5 rounded-[1.5rem] transition-all hoverShadow-blue hover:-translate-y-1">
                    Book Personalized Counseling <ArrowRight size={20} className="ml-1 inline" />
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-black px-10 py-4.5 rounded-[1.5rem] transition-all flex items-center gap-3"
                  >
                    <ArrowRight size={20} className="rotate-[135deg]" />
                    Official Inquiry
                  </a>
                </div>
             </div>
          </div>
        </div>
      </main>

      <VideoModal lecture={playing} onClose={() => setPlaying(null)} />

      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <div className="container mx-auto px-4">
           <div className="flex justify-center gap-8 mb-6">
              <Link href="/" className="text-gray-400 hover:text-[#1e3a8a] font-bold transition-all">Portal</Link>
              <Link href="/gallery" className="text-gray-400 hover:text-[#1e3a8a] font-bold transition-all">Gallery</Link>
              <Link href="/lectures" className="text-[#1e3a8a] font-black border-b-2 border-[#1e3a8a] pb-1">Lectures</Link>
           </div>
           <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 Mentor Merits Academy · Precision Coaching</p>
        </div>
      </footer>
    </>
  );
}
