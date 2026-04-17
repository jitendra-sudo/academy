"use client";
import React from "react";
import { 
  ShieldCheck, 
  Star, 
  Crown, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Clock,
  RefreshCw
} from "lucide-react";

const MentorshipPricing = () => {
  const plans = [
    {
      name: "Essential Mentorship",
      group: "One-To-Four",
      duration: "Valid for 10 months",
      price: "Enquire for Pricing",
      features: [
        "1-To-4 Mentoring Every 3 Days",
        "General Study Plan, Time Table & Targets",
        "Answer Writing with Model Answers",
        "Essay Writing Programme",
        "Prelims Test Series",
        "GS Course",
        "Daily Current Affairs",
      ],
      highlight: "Perfect for Peer Learning",
      icon: <ShieldCheck size={32} />,
      color: "blue",
    },
    {
      name: "Premium Mentorship",
      group: "One-On-One",
      duration: "Valid for 10 months",
      price: "Enquire for Pricing",
      popular: true,
      features: [
        "1-On-1 Mentoring on Every 3 Days",
        "Personalized Study Plan, Time Table & Supervision",
        "Answer Writing with Evaluation",
        "Essay Writing Programme",
        "Prelims Test Series",
        "GS Course",
        "Daily Current Affairs",
      ],
      highlight: "Personalized Strategy",
      icon: <Star size={32} />,
      color: "amber",
    },
    {
      name: "Platinum Mentorship",
      group: "One-On-One",
      duration: "Valid for 10 months",
      price: "Enquire for Pricing",
      features: [
        "1-On-1 Mentoring on Every Day",
        "Personalized Time Table",
        "Personalized Study Plan & Supervision",
        "Essay Writing Programme",
        "Prelims Test Series",
        "GS Course",
        "CSAT Course",
        "Interview Mentorship",
        "Daily Current Affairs",
        "Contemporary Issues Notes",
        "Paper Discussions",
      ],
      highlight: "The Ultimate Guidance",
      icon: <Crown size={32} />,
      color: "indigo",
    },
  ];

  const fixItems = [
    {
      title: "Time Management",
      desc: "Mentors with 10+ Years of teaching experience at India's finest institutes, having helped hundreds crack the UPSC & TNPSC.",
      icon: <Clock size={32} />,
    },
    {
      title: "Discipline",
      desc: "Your mentor helps break down the vast syllabus into manageable tasks, making your preparation more focused and less overwhelming.",
      icon: <ShieldCheck size={32} />,
    },
    {
      title: "Consistency",
      desc: "Unlike mass coaching, experience mentorship that goes beyond academics, offering compassion & emotional encouragement to keep you motivated.",
      icon: <RefreshCw size={32} />,
    },
  ];

  return (
    <section className="py-24 bg-gray-50" id="mentorship">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-[#d97706]/10 text-[#d97706] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Star size={14} fill="currentColor" /> Premium Mentorship Programs
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Choose Your <span className="gradient-text">Pricing Plan</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Select the mentorship level that fits your learning style and goals. Every plan is designed to maximize your potential.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative group animate-fade-up ${
                plan.popular ? "scale-105 z-10" : "scale-100"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              <div
                className={`h-full bg-white rounded-3xl p-8 border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-amber-500 shadow-2xl shadow-amber-900/10"
                    : "border-gray-100 shadow-xl shadow-blue-900/5 hover:border-blue-200"
                }`}
              >
                {/* Plan Header */}
                <div className="mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 ${
                    plan.color === "blue" ? "bg-blue-100 text-[#1e3a8a]" : plan.color === "amber" ? "bg-amber-100 text-[#d97706]" : "bg-indigo-100 text-indigo-600"
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{plan.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {plan.group}
                    </span>
                    <span className="text-xs text-gray-500 font-medium italic">
                      {plan.duration}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{plan.highlight}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group/item">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        plan.popular ? "bg-amber-500 text-white" : "bg-gray-100 text-[#1e3a8a] group-hover/item:bg-[#1e3a8a] group-hover/item:text-white"
                      }`}>
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm text-gray-600 leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <a
                  href="#admission"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('selectPlan', { detail: plan.name }));
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 text-center block flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30"
                      : "bg-[#1e3a8a] text-white hover:bg-[#1d4ed8]"
                  }`}
                >
                  Join Now <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* We Help You Fix Section */}
        <div className="bg-[#1e3a8a] rounded-[3rem] p-12 text-white relative overflow-hidden animate-fade-up">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-black mb-4">We Help You <span className="text-amber-400">Fix</span></h3>
                    <p className="text-blue-100 max-w-xl mx-auto">Address the root causes of preparation fatigue with our expert-led strategy.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {fixItems.map((item) => (
                        <div key={item.title} className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/20 transition-all group">
                            <div className="mb-4 text-amber-400 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                            <h4 className="text-xl font-bold mb-3 text-amber-300">{item.title}</h4>
                            <p className="text-sm text-blue-50 leading-relaxed">{item.desc}</p>
                        </div>
                  ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MentorshipPricing;
