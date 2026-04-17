"use client";
import React, { useState } from "react";
import { 
  Trophy, 
  Users, 
  Handshake, 
  Compass, 
  X, 
  Star,
  ArrowRight
} from "lucide-react";

const WhyChooseUs = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const cards = [
    {
      title: "Consistently Producing Toppers",
      desc: "Since 2022, our structured methodology has produced thousands of civil service officers.",
      icon: <Trophy size={28} />,
      image: "/classroom/classroom1.png",
    },
    {
      title: "Experienced Faculty (10+ Years)",
      desc: "Our faculty members bring deep domain expertise and personalized mentoring to each student.",
      icon: <Users size={28} />,
      image: "/classroom/classroom2.png",
    },
    {
      title: "3-Month Interview Programme",
      desc: "Comprehensive interview coaching with mock interviews and personality development.",
      icon: <Handshake size={28} />,
      image: "/classroom/classroom3.png",
    },
    {
      title: "360° Mentorship Programme",
      desc: "Ongoing support and expert guidance for strategy, opinions, and analytical skills.",
      icon: <Compass size={28} />,
      image: "/classroom/classroom4.png",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-[#d97706] px-4 py-1.5 rounded-full text-sm font-black mb-4">
            <Star size={14} fill="currentColor" /> Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            What Makes Us <span className="text-[#1e3a8a]">India&apos;s Best?</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-500 font-medium text-lg leading-relaxed">
            Mentor Merits Academy stands as the best academy, offering a holistic, structured, and result-oriented approach.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(card.image)}
              className="group cursor-pointer bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 animate-fade-up text-left flex flex-col items-start gap-4 relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[3rem] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] group-hover:bg-blue-100 transition-colors relative z-10">
                {card.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-[#1e3a8a] transition-colors">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
              
              {/* Bottom Tip */}
              <div className="mt-auto pt-4 relative z-10">
                <span className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  Click to View Classroom <ArrowRight size={10} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Info Badge */}
        <div className="mt-16 inline-flex items-center gap-4 bg-gray-50 py-3 px-6 rounded-2xl animate-fade-up">
            <span className="p-2 bg-green-100 rounded-lg text-green-600">🔔</span>
            <p className="text-sm font-bold text-gray-600">Explore our 2026 Batch highlights and environment.</p>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-md" />
          
          {/* Modal Content */}
          <div 
            className="relative max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="relative aspect-video">
                <img 
                  src={selectedImage} 
                  alt="Classroom"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent p-8">
                    <h4 className="text-white text-2xl font-black mb-2">Experience our Classroom Environment</h4>
                    <p className="text-gray-200 text-sm">Empowering aspirants through interactive and direct mentorship sessions.</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhyChooseUs;
