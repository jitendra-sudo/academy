"use client";
import React from "react";
import { 
  Database, 
  TrendingUp, 
  Image as ImageIcon, 
  Crown, 
  Briefcase, 
  Sprout, 
  RefreshCw, 
  Brain, 
  Handshake, 
  Check,
  Layout 
} from "lucide-react";

const MentorshipValue = () => {
  const values = [
    {
      title: "Daily Study Plan — Fully Personalised",
      desc: "Tailored to your time, strengths, weaknesses, routine, past prep & even job hours.",
      bg: "bg-gray-100",
      border: "border-gray-200",
    },
    {
      title: "Powered by Real Topper Data + Mentor Insights",
      desc: "Backed by 100+ toppers' data and 5000+ hours of hands-on UPSC mentorship",
      bg: "bg-amber-100",
      border: "border-amber-200",
    },
    {
      title: "Visual Timeline to LBSNAA",
      desc: "Know exactly when you'll finish each subject + how many hours left.",
      bg: "bg-blue-100",
      border: "border-blue-200",
    },
    {
      title: "Recommended Sources + Smart Scheduling",
      desc: "lakshmikanth, NCERTs, Spectrum, shankar Ganesh, and more- all mapped to your preparation stage",
      bg: "bg-green-100",
      border: "border-green-200",
    },
  ];

  const revolutionaryItems = [
    {
      title: "Real-World Mentor Intelligence",
      desc: "Trained on 250+ toppers' study patterns, Time allocation, and UPSC trends – not your usual Chat GPT fluff.",
      icon: <Database size={24} />,
    },
    {
      title: "Adds Perspective To Your Success Trajectory",
      desc: "Tells you when you'll finish the syllabus — and how to reach 120+ in Prelims with Micro adjustments.",
      icon: <TrendingUp size={24} />,
    },
    {
      title: "Declutters the Syllabus Visually",
      desc: "Crisp, smart & concise study cues from Toppers - so you prepare with clarity and precision.",
      icon: <ImageIcon size={24} />,
    },
    {
      title: "AIR Study Tips",
      desc: "Get a clear path: subject → topic → subtopic → exam. See the full road, not just the next step.",
      icon: <Crown size={24} />,
    },
  ];

  const aspirants = [
    { type: "Working Professionals", icon: <Briefcase size={40} /> },
    { type: "First-Time Aspirants", icon: <Sprout size={40} /> },
    { type: "Repeaters", icon: <RefreshCw size={40} /> },
    { type: "Mentally Drained students", icon: <Brain size={40} /> },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* What You Get Section */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            What You <span className="text-[#1e3a8a]">Get</span> With Your Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className={`${v.bg} ${v.border} border-2 p-8 rounded-[2rem] text-left transition-transform hover:scale-[1.02] duration-300`}
              >
                <h4 className="text-xl font-black text-gray-900 mb-3">{v.title}</h4>
                <p className="text-gray-700 leading-relaxed text-sm flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 shrink-0" /> {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Revolutionary Section */}
        <div className="mt-24 bg-gray-50 rounded-[3rem] p-12 border border-gray-100 animate-fade-up">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                Exclusive Innovation
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
                What Makes This Study Planner <span className="text-[#d97706]">Revolutionary</span>
              </h3>
              <div className="space-y-8">
                {revolutionaryItems.map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#d97706] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 mb-1">{item.title}</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
                <div className="absolute -inset-10 bg-amber-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 rotate-2">
                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-[#d97706] mb-6">
                            <Handshake size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 mb-4">You + Master Mentor</h4>
                        <p className="text-gray-600 text-sm">The perfect synergy of AI-driven data and human emotional intelligence.</p>
                        <div className="mt-8 flex gap-2">
                            <span className="w-3 h-3 bg-red-400 rounded-full animate-bounce" />
                            <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Aspirant Types Section */}
        <div className="mt-24 text-center animate-fade-up">
            <div className="bg-blue-50/50 py-16 px-8 rounded-[3rem] border border-blue-100/50">
                <h3 className="text-3xl font-black text-gray-900 mb-12">Built For <span className="gradient-text">Every Type</span> Of Aspirant</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {aspirants.map((asp, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="text-[#1e3a8a] mb-4 group-hover:rotate-12 transition-transform">
                                {asp.icon}
                            </div>
                            <p className="font-bold text-gray-800 text-sm">{asp.type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MentorshipValue;
