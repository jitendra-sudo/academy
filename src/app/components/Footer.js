"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "2900+", label: "IAS/IPS/IFS Selections" },
            { number: "202", label: "UPSC CSE 2025 Selections" },
            { number: "47", label: "TNPSC Group I Selections" },
            { number: "20+", label: "Years of Excellence" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-3xl md:text-4xl font-black text-amber-400 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <div>
              <div className="text-white font-black text-lg leading-none">
                MENTORS MERITS
              </div>
              <div className="text-amber-400 font-semibold text-xs tracking-widest">
                ACADEMY
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            India&apos;s premier UPSC coaching institute with 20+ years
            of excellence, producing toppers and meriting success consistently.
          </p>
          <div className="flex gap-3">
            {["facebook", "twitter", "youtube", "instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-8 h-8 bg-gray-700 hover:bg-[#1e3a8a] rounded-full flex items-center justify-center transition-colors"
                aria-label={social}
              >
                <span className="text-xs">
                  {social === "facebook"
                    ? "f"
                    : social === "twitter"
                      ? "𝕏"
                      : social === "youtube"
                        ? "▶"
                        : "📸"}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* UPSC Courses */}
        <div>
          <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">
            UPSC Courses
          </h3>
          <ul className="space-y-2">
            {[
              "About Civil Service",
              "UPSC 2026 Admissions",
              "Prelims Test Series 2026",
              "Mains Test Series 2025",
              "Optional Programme 2026",
              "Interview Guidance 2026",
              "Sadhana II Year Course",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#courses"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                >
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* TNPSC Courses */}
        <div>
          <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">
            TNPSC Courses
          </h3>
          <ul className="space-y-2">
            {[
              "Group I & II Prelims 2026",
              "Group I Mock Interview 2026",
              "Group II/IIA Test Series",
              "General English Workshop",
              "Current Affairs Programme",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#courses"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                >
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider mt-6 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "#about" },
              { label: "Blog", href: "#blog" },
              { label: "Careers", href: "#careers" },
              { label: "Admin Panel", href: "/admin" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                >
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">
            Contact Us
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Anna Nagar, Chennai</p>
                <p className="text-gray-400 text-xs">Tamil Nadu - 600040</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 text-sm">9003190030</p>
                <p className="text-gray-400 text-xs">044-66024500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm">admissions@academy.in</p>
            </div>

            {/* Branches */}
            <div className="mt-4">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Our Branches
              </p>
              <div className="flex flex-wrap gap-1">
                {[
                  "Chennai",
                  "Delhi",
                  "Bengaluru",
                  "Hyderabad",
                  "Thiruvananthapuram",
                  "Trichy",
                  "Salem",
                  "Madurai",
                  "Coimbatore",
                ].map((city) => (
                  <span
                    key={city}
                    className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-xs">
            © 2026 Mentors Merits Academy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white text-xs">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">
              Terms & Conditions
            </a>
            <Link
              href="/admin"
              className="text-amber-400 hover:text-amber-300 text-xs font-medium"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
