"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const navItems = [
  {
    label: "About",
    href: "#about",
    dropdown: [
      { label: "About Academy", href: "#about" },
      { label: "Why Choose Us", href: "#why-us" },
      { label: "Infrastructure", href: "#infrastructure" },
      { label: "Our Faculty", href: "#faculty" },
    ],
  },
  {
    label: "UPSC",
    href: "#upsc",
    dropdown: [
      { label: "About Civil Service", href: "#upsc" },
      { label: "UPSC 2026 Admissions Open", href: "#courses" },
      { label: "Prelims Test Series 2026", href: "#courses" },
      { label: "Mains Test Series 2025", href: "#courses" },
      { label: "Optional Programme 2026", href: "#courses" },
      { label: "Interview Guidance 2026", href: "#courses" },
    ],
  },
  {
    label: "TNPSC",
    href: "#tnpsc",
    dropdown: [
      { label: "TNPSC Group I & II 2026", href: "#courses" },
      { label: "Group I Prelims Test Series", href: "#courses" },
      { label: "General English Workshop", href: "#courses" },
    ],
  },
  { label: "Banking", href: "#banking" },
  {
    label: "Learning Corner",
    href: "#learning",
    dropdown: [
      { label: "Study Materials", href: "#resources" },
      { label: "Current Affairs", href: "#current-affairs" },
      { label: "Daily Quiz", href: "#quiz" },
      { label: "Mentoring Support", href: "#mentoring" },
    ],
  },
  { label: "Achievements", href: "#achievements" },
  {
    label: "Event Gallery",
    href: "#gallery",
    dropdown: [
      { label: "Inauguration Day 2025", href: "#gallery" },
      { label: "20 Years Celebration", href: "#gallery" },
      { label: "Toppers Felicitation 2025", href: "#gallery" },
      { label: "Teachers Day 2025", href: "#gallery" },
    ],
  },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1e3a8a] text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              admissions@academy.in
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              UPSC: 9003190030 | TNPSC: 044-43533445
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <a
              href="#branches"
              className="hover:text-amber-400 transition-colors"
            >
              🏢 Our Branches
            </a>
            <Link
              href="/admin"
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-white shadow-md"
        }`}
        id="main-navbar"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <div>
                <div className="text-[#1e3a8a] font-black text-lg leading-none">
                  MENTORS MERITS
                </div>
                <div className="text-amber-600 font-semibold text-xs tracking-widest">
                  ACADEMY
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1e3a8a] transition-colors flex items-center gap-1 rounded-md hover:bg-blue-50"
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg
                        className="w-3 h-3 transition-transform group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </a>
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg border border-gray-100 min-w-56 py-2 z-50 dropdown-menu">
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="#admission"
                className="px-4 py-2 text-sm font-semibold text-[#1e3a8a] border-2 border-[#1e3a8a] rounded-lg hover:bg-[#1e3a8a] hover:text-white transition-all"
              >
                Admission
              </a>
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Admin Panel
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              id="mobile-menu-btn"
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-md"
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === item.label ? null : item.label
                      )
                    }
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                  {item.dropdown && mobileExpanded === item.label && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded"
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="#admission"
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-[#1e3a8a] border-2 border-[#1e3a8a] rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Admission Enquiry
                </a>
                <Link
                  href="/admin"
                  className="w-full text-center px-4 py-2 text-sm font-semibold bg-[#1e3a8a] text-white rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
