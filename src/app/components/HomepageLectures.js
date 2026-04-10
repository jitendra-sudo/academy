"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

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
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{lecture.course}</span>
              {lecture.subject && <span className="text-gray-400 text-xs">{lecture.subject}</span>}
              {lecture.instructor && <span className="text-gray-400 text-xs">👤 {lecture.instructor}</span>}
              {lecture.duration && <span className="text-gray-400 text-xs font-mono">⏱ {lecture.duration}</span>}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg shrink-0">✕</button>
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
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-4">
              <span className="text-lg">🎬</span>
              <span className="text-[#1e3a8a] font-semibold text-sm">Free Video Lectures</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Learn From Expert <span className="text-[#1e3a8a]">UPSC Faculty</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Access free video lectures on all UPSC subjects — History, Polity, Economy, Current Affairs, Ethics and more.
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lec) => (
                <div
                  key={lec._id || lec.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setPlaying(lec)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] overflow-hidden">
                    {lec.thumbnailUrl ? (
                      <img src={lec.thumbnailUrl} alt={lec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🎬</div>
                    )}
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center text-[#1e3a8a] shadow-2xl">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    {/* Course badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#1e3a8a]/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">{lec.course}</span>
                    </div>
                    {lec.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</span>
                      </div>
                    )}
                    {lec.duration && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-black/70 text-white text-xs font-mono px-2 py-0.5 rounded-full">⏱ {lec.duration}</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#1e3a8a] transition-colors">{lec.title}</h3>
                    <div className="flex items-center gap-2">
                      {lec.subject && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{lec.subject}</span>}
                      {lec.instructor && <span className="text-gray-400 text-xs">👤 {lec.instructor}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All CTA */}
          {lectures.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/lectures"
                className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                View All Lectures
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="text-gray-400 text-sm mt-2">100% free · No signup required</p>
            </div>
          )}
        </div>
      </section>

      <VideoModal lecture={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
