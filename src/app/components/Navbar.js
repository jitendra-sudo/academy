"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  MessageCircle,
  Newspaper,
  BookOpen
} from "lucide-react";

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
      {
        heading: "UPSC EXAMS",
        items: [
          { label: "CSE", href: "#courses" },
          { label: "CDS - Combined Defence Service", href: "#courses" },
          { label: "NDA", href: "#courses" },
          { label: "CAPF", href: "#courses" },
        ]
      },
      {
        heading: "PROGRAMME 2027",
        items: [
          { label: "Prelims Test Series 2027", href: "#courses" },
          { label: "Mains Test Series 2027", href: "#courses" },
          { label: "Optional Programme 2027", href: "#courses" },
          { label: "Interview Guidance 2027", href: "#courses" },
        ]
      },
      {
        heading: "RESOURCES",
        items: [
          { label: "About Civil Service", href: "#upsc" },
          { label: "UPSC 2026 Admissions Open", href: "#courses" },
        ]
      }
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
  {
    label: "Bank & SSC",
    href: "#bank-ssc",
    dropdown: [
      {
        heading: "BANKING",
        items: [
          { label: "IBPS PO", href: "#courses" },
          { label: "IBPS Clerk", href: "#courses" },
        ]
      },
      {
        heading: "RBI",
        items: [
          { label: "RBI Grade B Officer", href: "#courses" },
          { label: "RBI Assistant", href: "#courses" },
        ]
      },
      {
        heading: "NABARD",
        items: [
          { label: "Grade A", href: "#courses" },
          { label: "Grade B", href: "#courses" },
        ]
      },
      {
        heading: "SSC",
        items: [
          { label: "SSC CGL", href: "#courses" },
          { label: "SSC CHSL", href: "#courses" },
          { label: "SSC GD Constable", href: "#courses" },
          { label: "SSC JE", href: "#courses" },
        ]
      }
    ]
  },
  {
    label: "Learning Corner",
    href: "#learning",
    dropdown: [
      { label: "Study Materials", href: "#resources" },
      { label: "Mentoring Support", href: "#mentoring" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
    isLink: true,
    dropdown: [
      { label: "UPSC Classroom Sessions", href: "/gallery", isLink: true },
    ],
  },
    { label: "Contact", href: "#contact", isContactModal: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [contactModal, setContactModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", course: "" });
  const [leadStatus, setLeadStatus] = useState(""); // ""|"loading"|"success"|"error"
  const [leadError, setLeadError] = useState("");
  const [contact, setContact] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


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
  // Fetch contact info from API
  useEffect(() => {
    fetch(apiUrl("/api/settings"))
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.contact) setContact(d.data.contact);
        if (d.success && d.data?.media?.logoUrl) setLogoUrl(d.data.media.logoUrl);
      })
      .catch(() => { });

    fetch(apiUrl("/api/announcements"))
      .then((r) => r.json())
      .then((d) => { if (d.success) setAnnouncements(d.data || []); });
  }, []);

  const submitLead = async (e) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      setLeadError("Name and phone are required.");
      return;
    }
    setLeadStatus("loading");
    setLeadError("");
    try {
      const res = await fetch(apiUrl("/api/leads"), {
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

  const upscPhone = contact?.upscPhone || "7397236970";
  const upscPhone2 = contact?.upscPhone2 || "7397236970";
  const tnpscPhone = contact?.tnpscPhone || "7397236970";
  const tnpscPhone2 = contact?.tnpscPhone2 || "7397236970";
  const whatsappNum = contact?.whatsapp || "+917397236970";
  const email = contact?.email || "admissions@mentormerits.in";
  const enquiryEmail = contact?.enquiryEmail || "enquiry@mentormerits.in";
  const address = contact?.address || "109/18, 2nd floor, vanavil appartment c- sector, east main road, +917397236970, Anna Nagar West Extension, Chennai";
  const addressLine2 = contact?.addressLine2 || "Tamil Nadu – 600040";


  const contactInfoData = [
    { icon: <Phone size={16} className="text-[#1e3a8a] group-hover:text-white" />, label: "UPSC Admissions", value: upscPhone, sub: upscPhone2 },
    { icon: <Phone size={16} className="text-[#1e3a8a] group-hover:text-white" />, label: "TNPSC Admissions", value: tnpscPhone, sub: tnpscPhone2 },
    { icon: <Mail size={16} className="text-[#1e3a8a] group-hover:text-white" />, label: "Email", value: email, sub: enquiryEmail },
    { icon: <MapPin size={16} className="text-[#1e3a8a] group-hover:text-white" />, label: "Head Office", value: address, sub: addressLine2 },
  ];

  // Strip leading + and non-digits for wa.me link
  const waNum = whatsappNum.replace(/\D/g, "");

  return (
    <>
      {/* Announcement Bar */}
      {announcements.length > 0 && (
        <div className="bg-[#1e3a8a] text-white py-1.5 px-4 overflow-hidden relative z-[60]">
          <div className="mx-auto flex items-center justify-center gap-4 w-full">
            <div className="flex items-center gap-2 overflow-hidden  min-w-7xl max-w-7xl ">
               {announcements.map((ann, idx) => (
                 <div key={ann._id || idx} className="whitespace-nowrap flex items-center gap-2 animate-marquee">
                    <span className="text-[10px] sm:text-xs font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full uppercase shrink-0 flex items-center gap-1">
                      <Newspaper size={10} /> News
                    </span>
                   {ann.link ? (
                     <a href={ann.link} className="text-[11px] sm:text-sm font-semibold hover:underline">
                       {ann.text}
                     </a>
                   ) : (
                     <span className="text-[11px] sm:text-sm font-semibold">{ann.text}</span>
                   )}
                   {idx < announcements.length - 1 && <span className="mx-4 text-white/30">|</span>}
                 </div>
               ))}
            </div>
          </div>
          {/* Add custom style for marquee if needed, or just keep it static if multiple items are too long */}
          <style jsx>{`
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white shadow-lg border-b border-gray-100"
          : "bg-white shadow-md"
          }`}
        id="main-navbar"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src={logoUrl || "/logo.jpg"}
                alt="Mentor Merits Academy Logo"
                className="h-12 w-12 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="text-[#1e3a8a] font-black text-lg leading-none">
                  MENTOR MERITS
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
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
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
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                      )}
                    </a>
                  )}
                  {item.dropdown && activeDropdown === item.label && (
                    <div className={`absolute top-full left-0 bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 z-50 dropdown-menu animate-fade-in ${item.label === "Bank & SSC" || item.label === "UPSC" ? "min-w-[480px] grid grid-cols-2 gap-2 px-3" : "min-w-64"}`}>
                      {item.dropdown.map((sub, idx) => (
                        <div key={idx} className={sub.heading ? "p-2" : ""}>
                          {sub.heading ? (
                            <>
                              <div className="px-3 py-1 text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest mb-1 bg-blue-50/50 rounded-lg">
                                {sub.heading}
                              </div>
                              <div className="space-y-0.5">
                                {sub.items.map((subItem, sIdx) => (
                                  <Link
                                    key={sIdx}
                                    href={subItem.href}
                                    className="block px-3 py-1.5 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50/50 rounded-lg transition-all font-medium"
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            sub.isLink ? (
                              <Link href={sub.href}
                                className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors font-medium"
                              >
                                {sub.label}
                              </Link>
                            ) : (
                              <a
                                href={sub.href}
                                className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors font-medium"
                              >
                                {sub.label}
                              </a>
                            )
                          )}
                        </div>
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
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
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
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
                        className={`w-4 h-4 transition-transform ${mobileExpanded === item?.label ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {item.dropdown && mobileExpanded === item.label && (
                    <div className="pl-4 mt-1 space-y-2 border-l-2 border-blue-50 ml-3 py-2">
                      {item.dropdown.map((sub, idx) => (
                        <div key={idx}>
                          {sub.heading ? (
                            <div className="mb-3">
                              <div className="px-3 py-1 text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest mb-1">
                                {sub.heading}
                              </div>
                              <div className="space-y-1">
                                {sub.items.map((subItem, sIdx) => (
                                  <Link
                                    key={sIdx}
                                    href={subItem.href}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            sub.isLink ? (
                              <Link
                                href={sub.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg"
                                onClick={() => setMobileOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            ) : (
                              <a
                                href={sub.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg"
                                onClick={() => setMobileOpen(false)}
                              >
                                {sub.label}
                              </a>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <button
                  id="mobile-contact-btn"
                  onClick={() => { setContactModal(true); setMobileOpen(false); }}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-[#1e3a8a] border-2 border-[#1e3a8a] rounded-lg flex items-center justify-center gap-2"
                >
                  <Phone size={14} /> Contact Us
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
                <X size={18} />
              </button>
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={logoUrl || "/logo.jpg"}
                    alt="Mentor Merits Academy"
                    className="w-12 h-12 object-contain rounded-full bg-white/10"
                  />
                  <div>
                    <div className="text-white font-black text-lg leading-none">MENTOR MERITS</div>
                    <div className="text-amber-300 text-xs font-semibold tracking-widest">ACADEMY</div>
                  </div>
                </div>
                <h2 className="text-white font-black text-xl">Contact Us</h2>
                <p className="text-blue-200 text-sm">We&apos;re here to help you succeed in UPSC</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-6 space-y-3">
              {contactInfoData.map((c) => (
                <div key={c.label} className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group">
                  <div className="w-10 h-10 bg-[#1e3a8a]/10 group-hover:bg-[#1e3a8a] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    {c.icon}
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
                href={`https://wa.me/${waNum}?text=Hi, I am looking for UPSC admissions`}
                target="_blank"
                rel="noreferrer"
                id="contact-modal-whatsapp"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href="/#admission"
                id="contact-modal-admission"
                onClick={() => setContactModal(false)}
                className="flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md"
              >
                <BookOpen size={18} />
                Admission Form
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
