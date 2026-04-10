"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

// Color palette for categories (cycles if more than 4 courses added)
const PALETTE = [
  { color: "bg-blue-50 border-blue-200", accent: "bg-[#1e3a8a]", textAccent: "text-[#1e3a8a]", dot: "bg-[#1e3a8a]" },
  { color: "bg-green-50 border-green-200", accent: "bg-green-700", textAccent: "text-green-700", dot: "bg-green-600" },
  { color: "bg-purple-50 border-purple-200", accent: "bg-purple-700", textAccent: "text-purple-700", dot: "bg-purple-600" },
  { color: "bg-amber-50 border-amber-200", accent: "bg-amber-600", textAccent: "text-amber-700", dot: "bg-amber-500" },
  { color: "bg-rose-50 border-rose-200", accent: "bg-rose-700", textAccent: "text-rose-700", dot: "bg-rose-500" },
];

function CourseSkeleton() {
  return (
    <div className="border-2 border-gray-100 bg-gray-50 rounded-2xl p-6 animate-pulse">
      <div className="h-7 bg-gray-200 rounded-lg w-28 mb-5" />
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
        ))}
      </div>
      <div className="mt-5 h-10 bg-gray-200 rounded-xl" />
    </div>
  );
}

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/courses"))
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data?.length) setCourses(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const gridClass = courses.length <= 2
    ? "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
    : "grid md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/50" id="courses">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/10 text-[#1e3a8a] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            📚 Our Programmes
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Comprehensive{" "}
            <span className="gradient-text">Courses &amp; Programmes</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From foundation courses to advanced test series — we have the
            perfect programme for every aspirant at every stage of preparation.
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <CourseSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📚</div>
            <p>Courses coming soon. Check back later!</p>
          </div>
        ) : (
          <div className={gridClass}>
            {courses.map((cat, idx) => {
              const theme = PALETTE[idx % PALETTE.length];
              const color = cat.color || theme.color;
              const accent = cat.accent || theme.accent;
              const dot = cat.dot || theme.dot;
              return (
                <div
                  key={cat.id || cat._id || cat.category}
                  className={`border-2 ${color} rounded-2xl p-6 card-hover`}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`${accent} text-white px-3 py-1 rounded-lg text-sm font-bold`}>
                      {cat.category}
                    </div>
                    <div className="h-px flex-1 bg-current opacity-20" />
                  </div>
                  {/* Course List */}
                  <ul className="space-y-2.5">
                    {(cat.items || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 group cursor-pointer">
                        <div className={`w-1.5 h-1.5 ${dot} rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform`} />
                        <span className="text-sm text-gray-700 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#admission"
                    className={`mt-5 block w-full text-center ${accent} text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 hover:shadow-md transition-all`}
                  >
                    Enquire Now →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
