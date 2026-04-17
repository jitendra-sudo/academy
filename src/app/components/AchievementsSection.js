"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Trophy, Star, ArrowRight } from "lucide-react";

// ── "Why Choose Us" features – static marketing content, no API needed ──────
const features = [
  {
    icon: "🏆",
    title: "Consistently Producing Toppers",
    desc: "Since 2022, our structured methodology has produced thousands of civil service officers.",
  },
  {
    icon: "👨‍🏫",
    title: "Experienced Faculty (10+ Years)",
    desc: "Our faculty members bring deep domain expertise and personalized mentoring to each student.",
  },
  {
    icon: "🤝",
    title: "3-Month Interview Programme",
    desc: "Comprehensive interview coaching with mock interviews and personality development.",
  },
];

// Skeleton for achiever card
function AchieverSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 text-center animate-pulse">
      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3" />
      <div className="h-5 bg-white/20 rounded w-16 mx-auto mb-2" />
      <div className="h-4 bg-white/20 rounded w-24 mx-auto mb-1" />
      <div className="h-3 bg-white/10 rounded w-32 mx-auto" />
    </div>
  );
}

export default function AchievementsSection() {
  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticker, setTicker] = useState("Loading latest achievements...");

  useEffect(() => {
    fetch(apiUrl("/api/achievers"))
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length) {
          setAchievers(d.data);
          const items = d.data
            .slice(0, 8)
            .map((a) => `${a.name} – ${a.rank} (${a.exam || "UPSC"} ${a.year || ""})`)
            .join(" \u00a0|\u00a0 ");
          setTicker(items + " \u00a0|\u00a0 ");
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Ticker */}
      <div className="bg-[#1e3a8a] py-2.5 overflow-hidden" id="ticker">
        <div className="ticker-wrap">
          <div className="ticker-content text-white text-sm flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" /> {ticker}
          </div>
        </div>
      </div>

      {/* Toppers / Achievers */}
      <section className="py-20 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]" id="achievements">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Star size={16} fill="currentColor" /> Our Rank Holders
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Achievers From Our Academy
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              Our students have consistently secured top ranks in UPSC civil services examinations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <AchieverSkeleton key={i} />)
              : achievers.length === 0
                ? (
                  <div className="col-span-3 text-center py-12 text-blue-200">
                    <div className="flex justify-center mb-3 text-amber-400">
                      <Trophy size={48} />
                    </div>
                    <p>Achiever profiles will appear here once added.</p>
                  </div>
                )
                : achievers.map((a) => (
                  <div key={a._id || a.id || a.name} className="glass rounded-2xl p-5 card-hover text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <span className="text-white font-black text-lg">{(a.name || "A")[0]}</span>
                    </div>
                    <div className="text-amber-400 text-2xl font-black mb-1">{a.rank}</div>
                    <div className="text-white font-bold mb-1">{a.name}</div>
                    <div className="text-blue-200 text-xs">{a.course}</div>
                    <div className="mt-2 inline-block bg-white/10 text-blue-200 text-xs px-2 py-0.5 rounded-full">
                      {a.exam || "UPSC CSE"} {a.year}
                    </div>
                  </div>
                ))}
          </div>

          <div className="text-center">
            <a
              href="#admission"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:scale-105"
            >
              Apply for Admission <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
