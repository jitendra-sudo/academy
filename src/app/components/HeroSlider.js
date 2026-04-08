"use client";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "India's #1 Civil Services Coaching",
    subtitle: "UPSC 2026 Admissions Open",
    desc: "Join 2,900+ successful IAS, IPS & IFS officers trained by our expert faculty",
    badge: "🏆 Ranked #1 in India",
    cta: "Book Admission Now",
    cta2: "Know More",
    bg: "from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8]",
  },
  {
    id: 2,
    title: "202 Selections in UPSC CSE 2025",
    subtitle: "Results That Speak",
    desc: "Our students consistently rank among India's top civil service officers",
    badge: "🎯 Top Results 2025",
    cta: "View Achievers",
    cta2: "Our Courses",
    bg: "from-[#0f172a] via-[#064e3b] to-[#059669]",
  },
  {
    id: 3,
    title: "TNPSC Group I & II Admissions",
    subtitle: "2026 Batch Starting Soon",
    desc: "Comprehensive preparation with 47 selections out of 90 vacancies in 2024",
    badge: "📚 TNPSC Specialist",
    cta: "Enrol Now",
    cta2: "Course Details",
    bg: "from-[#0f172a] via-[#4c1d95] to-[#7c3aed]",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <section
      className={`relative min-h-[85vh] flex items-center bg-gradient-to-br ${slide.bg} transition-all duration-700 overflow-hidden`}
      id="hero"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div
        className={`relative max-w-7xl mx-auto px-4 py-20 w-full transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              {slide.badge}
            </div>

            <p className="text-amber-400 font-semibold text-lg mb-2 uppercase tracking-wider">
              {slide.subtitle}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {slide.title}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
              {slide.desc}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#admission"
                className="shimmer-btn text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {slide.cta} →
              </a>
              <a
                href="#about"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-white/20 transition-all"
              >
                {slide.cta2}
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
              {[
                { n: "20+", l: "Years" },
                { n: "2900+", l: "Selections" },
                { n: "10+", l: "Branches" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-black text-amber-400">
                    {s.n}
                  </div>
                  <div className="text-blue-200 text-xs">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              {
                icon: "🏆",
                title: "UPSC CSE 2025",
                value: "202",
                sub: "Selections from 958 total",
              },
              {
                icon: "⭐",
                title: "UPSC IFS 2024",
                value: "78",
                sub: "Out of 143 selections",
              },
              {
                icon: "🎯",
                title: "TNPSC Group I",
                value: "47/90",
                sub: "Vacancies filled 2024",
              },
              {
                icon: "🌟",
                title: "Top 100",
                value: "19",
                sub: "Candidates in top 100",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="glass rounded-2xl p-5 card-hover cursor-default"
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-1">
                  {card.title}
                </div>
                <div className="text-white text-3xl font-black mb-1">
                  {card.value}
                </div>
                <div className="text-blue-200 text-xs">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={handlePrev}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-amber-400" : "w-2 bg-white/40"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </section>
  );
}
