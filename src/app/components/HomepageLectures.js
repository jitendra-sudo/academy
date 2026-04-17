"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { Play, Video, Clock, ArrowRight, User, X } from "lucide-react";

function toEmbedUrl(url, type) {
  if (type === "youtube") {
    const match = url?.match(/(?:v=|youtu\.be\/|embed\/)([^&\s?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&autoplay=1` : url;
  }
  return url;
}

function VideoModal({ lecture, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!lecture) return null;
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h3 className="font-black text-gray-900 text-base line-clamp-2">{lecture.title}</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="bg-blue-50 text-[#1e3a8a] text-xs font-bold px-3 py-1 rounded-full">{lecture.course}</span>
              {lecture.subject && <span className="text-gray-500 text-xs flex items-center gap-1">{lecture.subject}</span>}
              {lecture.instructor && <span className="text-gray-500 text-xs flex items-center gap-1"><User size={12} /> {lecture.instructor}</span>}
              {lecture.duration && <span className="text-gray-500 text-xs flex items-center gap-1 font-mono"><Clock size={12} /> {lecture.duration}</span>}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="aspect-video bg-black">
          {lecture.videoType === "upload" ? (
            <video src={lecture.videoUrl} controls autoPlay className="w-full h-full" controlsList="nodownload" />
          ) : (
            <iframe src={toEmbedUrl(lecture.videoUrl, lecture.videoType)} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title={lecture.title} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomepageLectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/lectures?isPublic=true"))
      .then((r) => r.json())
      .then((d) => {
        const data = d.data || d.lectures || [];
        if (data.length) {
          const featured = data.filter((l) => l.isFeatured);
          const rest = data.filter((l) => !l.isFeatured);
          setLectures([...featured, ...rest].slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && lectures.length === 0) return null; // Hide if no lectures

  return (
    <>
      <section id="lectures" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/5 text-[#1e3a8a] px-4 py-2 rounded-full mb-4">
              <Video size={18} fill="currentColor" className="opacity-80" />
              <span className="font-bold text-sm tracking-tight">Free Video Lectures</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Learn From Expert <span className="text-[#1e3a8a]">UPSC Faculty</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Access curated video lectures on History, Polity, Economy, Current Affairs, and more — completely free.
            </p>
          </div>

          {/* Lecture Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {lectures.map((lec) => (
                <div
                  key={lec._id || lec.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100/80 hover:shadow-2xl hoverShadow-blue transition-all duration-500 cursor-pointer"
                  onClick={() => setPlaying(lec)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] overflow-hidden">
                    {lec.thumbnailUrl ? (
                      <img src={lec.thumbnailUrl} alt={lec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Video size={48} />
                      </div>
                    )}
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-[#1e3a8a]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white text-[#1e3a8a] rounded-full flex items-center justify-center shadow-2lx group-hover:scale-110 transition-transform duration-300">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                    {/* Course badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#1e3a8a]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                        {lec.course}
                      </span>
                    </div>
                    {lec.duration && (
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                          <Clock size={10} /> {lec.duration}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-3 leading-tight group-hover:text-[#1e3a8a] transition-colors duration-300">
                      {lec.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      {lec.instructor && (
                        <span className="text-gray-400 text-xs flex items-center gap-1.5">
                          <User size={12} /> {lec.instructor}
                        </span>
                      )}
                      {lec.subject && (
                        <span className="text-amber-600 font-bold text-[10px] uppercase tracking-wider">
                          {lec.subject}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All CTA */}
          {lectures.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/lectures"
                className="shimmer-btn inline-flex items-center gap-3 text-white font-black px-10 py-4 rounded-2xl transition-all hover:shadow-2lx hoverShadow-blue hover:-translate-y-1"
              >
                Explore Full Lecture Library
                <ArrowRight size={20} />
              </Link>
              <p className="text-gray-400 text-xs mt-4 font-medium tracking-wide uppercase">
                Free Educational Content · Quality Education for All
              </p>
            </div>
          )}
        </div>
      </section>

      <VideoModal lecture={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
