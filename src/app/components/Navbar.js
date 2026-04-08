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
    label: "Gallery",
    href: "/gallery",
    isLink: true,
    dropdown: [
      { label: "UPSC Classroom Sessions", href: "/gallery", isLink: true },
      { label: "Toppers Felicitation", href: "/gallery", isLink: true },
      { label: "Mock Interviews", href: "/gallery", isLink: true },
      { label: "Events & Celebrations", href: "/gallery", isLink: true },
    ],
  },
  { label: "Contact", href: "#contact", isContactModal: true },
];

const contactInfo = [
  { icon: "📞", label: "UPSC Admissions", value: "9003190030", sub: "044-66024500" },
  { icon: "📞", label: "TNPSC Admissions", value: "7667766266", sub: "044-43533445" },
  { icon: "📧", label: "Email", value: "admissions@mentorsmerits.in", sub: "enquiry@mentorsmerits.in" },
  { icon: "🕐", label: "Working Hours", value: "Mon – Sat: 9AM – 7PM", sub: "Sunday: 10AM – 2PM" },
  { icon: "📍", label: "Head Office", value: "Anna Nagar, Chennai", sub: "Tamil Nadu – 600040" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", course: "" });
  const [leadStatus, setLeadStatus] = useState(""); // ""|"loading"|"success"|"error"
  const [leadError, setLeadError] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = contactModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [contactModal]);

  const closeContactModal = () => {
    setContactModal(false);
    setLeadForm({ name: "", phone: "", course: "" });
    setLeadStatus("");
    setLeadError("");
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      setLeadError("Name and phone are required.");
      return;
    }
    setLeadStatus("loading");
    setLeadError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadForm, source: "contact-modal" }),
      });
      const data = await res.json();
      if (data.success) {
        setLeadStatus("success");
        setLeadForm({ name: "", phone: "", course: "" });
      } else {
        setLeadError(data.error || "Submission failed.");
        setLeadStatus("");
      }
    } catch {
      setLeadError("Network error. Please try again.");
      setLeadStatus("");
    }
  };

  const handleNavClick = (item, e) => {
    if (item.isContactModal) {
      e.preventDefault();
      setContactModal(true);
      setMobileOpen(false);
    }
  };

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
              admissions@mentorsmerits.in
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              UPSC: 9003190030 | TNPSC: 7667766266
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/gallery" className="hover:text-amber-400 transition-colors">📸 Gallery</Link>
            <button onClick={() => setContactModal(true)} className="hover:text-amber-400 transition-colors">📞 Contact</button>
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
                  {item.isLink ? (
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1e3a8a] transition-colors flex items-center gap-1 rounded-md hover:bg-blue-50"
                    >
                      {item.label}
                      {item.dropdown && (
                        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1e3a8a] transition-colors flex items-center gap-1 rounded-md hover:bg-blue-50"
                    >
                      {item.label}
                      {item.dropdown && (
                        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </a>
                  )}
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg border border-gray-100 min-w-56 py-2 z-50 dropdown-menu">
                      {item.dropdown.map((sub) =>
                        sub.isLink ? (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ) : (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors"
                          >
                            {sub.label}
                          </a>
                        )
                      )}
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                    onClick={(e) => {
                      if (item.isContactModal) { handleNavClick(item, e); return; }
                      setMobileExpanded(mobileExpanded === item.label ? null : item.label);
                    }}
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {item.dropdown && mobileExpanded === item.label && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.dropdown.map((sub) =>
                        sub.isLink ? (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ) : (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <button
                  id="mobile-contact-btn"
                  onClick={() => { setContactModal(true); setMobileOpen(false); }}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-[#1e3a8a] border-2 border-[#1e3a8a] rounded-lg"
                >
                  📞 Contact Us
                </button>
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

      {/* ====== CONTACT MODAL ====== */}
      {contactModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setContactModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] p-6 relative">
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              <button
                id="contact-modal-close"
                onClick={() => setContactModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-colors"
                aria-label="Close contact modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black">M</span>
                  </div>
                  <div>
                    <div className="text-white font-black text-lg leading-none">MENTORS MERITS</div>
                    <div className="text-amber-300 text-xs font-semibold tracking-widest">ACADEMY</div>
                  </div>
                </div>
                <h2 className="text-white font-black text-xl">Contact Us</h2>
                <p className="text-blue-200 text-sm">We&apos;re here to help you succeed in UPSC</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-6 space-y-3">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group">
                  <div className="w-10 h-10 bg-[#1e3a8a]/10 group-hover:bg-[#1e3a8a] rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">
                    <span className="group-hover:scale-110 transition-transform inline-block">{c.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{c.label}</div>
                    <div className="font-bold text-gray-900 text-sm truncate">{c.value}</div>
                    {c.sub && <div className="text-gray-500 text-xs">{c.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/919003190030?text=Hi, I am looking for UPSC admissions"
                target="_blank"
                rel="noreferrer"
                id="contact-modal-whatsapp"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="/#admission"
                id="contact-modal-admission"
                onClick={() => setContactModal(false)}
                className="flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md"
              >
                📝 Admission Form
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
