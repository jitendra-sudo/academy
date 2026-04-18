"use client";
import React from "react";
import { 
  GraduationCap, 
  Target, 
  Rocket, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  Users, 
  Book, 
  Brain, 
  BarChart3, 
  Sparkles, 
  Sprout 
} from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-24 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/10 text-[#1e3a8a] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <GraduationCap size={16} /> About Mentor Merits Academy
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Building Success Through <span className="gradient-text">Mentorship</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg">
            Mentor Merits Academy is a dynamic and student-focused learning platform established in 2025, with a clear mission to nurture aspirants preparing for competitive examinations.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100/50">
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-4">Our Story</h3>
              <p className="text-gray-600 leading-relaxed">
                At Mentor Merits Academy, we believe that success in competitive exams is not just about hard work, but about right guidance, structured preparation, and consistent mentorship. As a newly established institution in 2025, we bring fresh perspectives, updated strategies, and personalized attention to every student.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-[#d97706] mb-4">
                <Target size={24} />
              </div>
                <h4 className="font-black text-gray-900 mb-2">Our Vision</h4>
                <p className="text-sm text-gray-600">
                  To become a trusted center of excellence that transforms aspirants into successful civil servants through quality education and ethical mentorship.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#1e3a8a] mb-4">
                <Rocket size={24} />
              </div>
                <h4 className="font-black text-gray-900 mb-2">Our Mission</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-none">
                  <li>• Concept-based coaching</li>
                  <li>• Strong fundamentals (NCERT to adv)</li>
                  <li>• Continuous mentorship</li>
                  <li>• Affordable & accessible education</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1e3a8a]/20 to-[#d97706]/20 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-6 flex items-center gap-3">
                <BookOpen size={28} /> What We Offer
              </h3>
              <div className="grid gap-4">
                {[
                  "Comprehensive coaching for UPSC, TNPSC, TNUSRB, BANKING, RRB, SSC, RBI, NABARD, SEBI, & PSU exams",
                  "Regular tests, MCQs, and current affairs sessions",
                  "Personal mentoring and doubt-clearing support",
                  "Focus on answer writing and analytical thinking"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="w-6 h-6 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us & Commitment */}
        <div className="mt-24 grid md:grid-cols-2 gap-12">
            <div className="space-y-6 animate-fade-up">
                <h3 className="text-2xl font-black text-[#1e3a8a] flex items-center gap-3">
                    <Lightbulb size={28} /> Why Choose Us?
                </h3>
                <div className="grid gap-4">
                    {[
                        { title: "Dedicated Mentorship", icon: <Users size={20} />, desc: "We guide each student personally" },
                        { title: "Concept Clarity First", icon: <Book size={20} />, desc: "Strong focus on fundamentals" },
                        { title: "Exam-Oriented Strategy", icon: <Brain size={20} />, desc: "Based on latest patterns and PYQs" },
                        { title: "Continuous Evaluation", icon: <BarChart3 size={20} />, desc: "Tests, feedback, and tracking" }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-[#1e3a8a]/30 transition-all">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3a8a]">
                                {feature.icon}
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900">{feature.title}</h5>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-[2.5rem] p-10 text-white relative overflow-hidden animate-fade-up shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <Sparkles size={28} className="text-amber-300" /> Our Commitment
                    </h3>
                    <p className="text-blue-50 leading-relaxed mb-8 text-lg">
                        "We are committed to guiding every aspirant with honesty, dedication, and result-oriented preparation, helping them move closer to their dream of serving the nation."
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-amber-300">
                            <Sprout size={32} />
                        </div>
                        <div>
                            <p className="text-white font-bold">Founded in 2025</p>
                            <p className="text-blue-200 text-sm">Passionate for Teaching</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
