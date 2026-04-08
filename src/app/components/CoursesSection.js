"use client";

const courses = [
  {
    category: "UPSC",
    color: "bg-blue-50 border-blue-200",
    accent: "bg-[#1e3a8a]",
    textAccent: "text-[#1e3a8a]",
    dot: "bg-[#1e3a8a]",
    items: [
      "UPSC 2026 Admissions Open – Pre-Booking Now",
      "All India UPSC Prelims Mock Test 2026",
      "UPSC Chakra Current Affairs Programme 2026",
      "UPSC Optional Programme 2026",
      "Prelims Test Series 2026",
      "Sadhana (II Year UPSC Foundation Course)",
      "Civils & Forest Service Interview Guidance 2026",
      "UPSC GS-Mains Test Series 2025 (Moksha)",
    ],
  },
  {
    category: "TNPSC",
    color: "bg-green-50 border-green-200",
    accent: "bg-green-700",
    textAccent: "text-green-700",
    dot: "bg-green-600",
    items: [
      "TNPSC Group I & II Preliminary Course 2026",
      "TNPSC Group I Mock Interview Programme 2026",
      "I'M TOP TNPSC Group I Prelims Test Series 2026",
      "I'M TOP TNPSC Group II/IIA Prelims Test Series",
      "I'M TOP TNPSC General English Workshop 2026",
    ],
  },
  {
    category: "Banking & SSC",
    color: "bg-purple-50 border-purple-200",
    accent: "bg-purple-700",
    textAccent: "text-purple-700",
    dot: "bg-purple-600",
    items: [
      "BANKING / SSC Admission 2026",
      "IB ACIO Free Mock Interview",
      "SSC CGL Tier I – Test Series 2026",
      "IBPS PO/Clerk Admissions",
      "RRB NTPC Coaching 2026",
    ],
  },
];

export default function CoursesSection() {
  return (
    <section
      className="py-20 bg-gradient-to-b from-white to-blue-50/50"
      id="courses"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/10 text-[#1e3a8a] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            📚 Our Programmes
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Comprehensive{" "}
            <span className="gradient-text">Courses & Programmes</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From foundation courses to advanced test series — we have the
            perfect programme for every aspirant at every stage of preparation.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((cat) => (
            <div
              key={cat.category}
              className={`border-2 ${cat.color} rounded-2xl p-6 card-hover`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`${cat.accent} text-white px-3 py-1 rounded-lg text-sm font-bold`}
                >
                  {cat.category}
                </div>
                <div className="h-px flex-1 bg-current opacity-20"></div>
              </div>

              {/* Course List */}
              <ul className="space-y-2.5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 group cursor-pointer"
                  >
                    <div
                      className={`w-1.5 h-1.5 ${cat.dot} rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform`}
                    />
                    <span
                      className={`text-sm text-gray-700 group-hover:${cat.textAccent} transition-colors leading-snug`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#admission"
                className={`mt-5 block w-full text-center ${cat.accent} text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 hover:shadow-md transition-all`}
              >
                Enquire Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
