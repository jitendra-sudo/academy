"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

export default function AdmissionSection() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", course: "", city: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contact info from API
  const [contact, setContact] = useState(null);
  // Courses from API (used to populate dropdown)
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch contact/settings
    fetch(apiUrl("/api/settings"))
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data?.contact) setContact(d.data.contact); })
      .catch(() => { });

    // Fetch courses for dropdown
    fetch(apiUrl("/api/courses"))
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data?.length) setCourses(d.data); })
      .catch(() => { });
  }, []);

  const upscPhone = contact?.upscPhone || "7397236970";
  const upscPhone2 = contact?.upscPhone2 || "7397236970";
  const tnpscPhone = contact?.tnpscPhone || "7397236970";
  const tnpscPhone2 = contact?.tnpscPhone2 || "7397236970";
  const admissionEmail = contact?.email || "admissions@mentormerits.in";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/admissions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setSubmittedId(data.data?.id || data.data?._id || "");
        setForm({ name: "", email: "", phone: "", course: "", city: "", message: "" });
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Build dropdown options from API courses; fallback to a hardcoded minimal list
  const courseOptions = courses.length > 0
    ? courses.flatMap((cat) => (cat.items || []).map((item) => ({ label: item, cat: cat.category })))
    : [
      { label: "UPSC Foundation Course", cat: "UPSC" },
      { label: "UPSC Prelims Test Series", cat: "UPSC" },
      { label: "TNPSC Group I & II", cat: "TNPSC" },
    ];

  return (
    <>
      {/* About Section */}
      <section className="py-20 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/10 text-[#1e3a8a] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                🎓 About Us
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                India&apos;s Most Trusted{" "}
                <span className="gradient-text">Civil Services Academy</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mentor Merits Academy is the top coaching institute for UPSC in India, providing excellent coaching
                for civil services aspirants with expert faculty, comprehensive study material and a systematic approach.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our courses are designed to the minutest detail, the syllabus coverage is extensive and the
                mentoring is personalized to provide the best preparation. We also focus on character development,
                ethics, and personality development for future civil servants.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { n: "10+", l: "Selections" },
                  { n: "10+", l: "Years" },
                  { n: "1+", l: "Branches" },
                  { n: "5,000+", l: "Aspirants" },
                ].map((s) => (
                  <div key={s.l} className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-[#1e3a8a]">{s.n}</div>
                    <div className="text-gray-600 text-sm">{s.l}</div>
                  </div>
                ))}
              </div>
              <a
                href="#admission"
                className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors shadow-md"
              >
                Enquire Now →
              </a>
            </div>

            {/* Online Classes Feature */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl p-6 text-white">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="font-black text-xl mb-2">Looking for Online Classes?</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  Learn from anywhere, anytime. Missed your classes? Worry not — we got you covered with our
                  recorded sessions and two-way live communication system.
                </p>
                <a href="#admission" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                  Explore Online →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Form */}
      <section className="py-20 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8]" id="admission">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left info */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                📝 Admission 2026
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Begin Your Civil Services Journey Today
              </h2>
              <p className="text-blue-100 leading-relaxed mb-8">
                Fill out the form and our counsellors will get back to you within 24 hours to help
                you choose the right course and batch.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "📞", text: `UPSC: ${upscPhone} | ${upscPhone2}` },
                  { icon: "📞", text: `TNPSC: ${tnpscPhone} | ${tnpscPhone2}` },
                  { icon: "📧", text: admissionEmail },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-3">
                    <span className="text-xl">{c.icon}</span>
                    <span className="text-blue-100">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-black text-gray-900 mb-6">Admission Consultation</h3>
              {submitted && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm font-medium">
                  ✅ Thank you! Your enquiry {submittedId ? `(ID: ${submittedId})` : ""} has been received. We&apos;ll contact you within 24 hours.
                </div>
              )}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="adm-name">Full Name *</label>
                    <input
                      id="adm-name" name="name" value={form.name} onChange={handleChange}
                      required placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="adm-phone">Phone *</label>
                    <input
                      id="adm-phone" name="phone" value={form.phone} onChange={handleChange}
                      required placeholder="Your phone number"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="adm-email">Email</label>
                  <input
                    id="adm-email" name="email" value={form.email} onChange={handleChange}
                    type="email" placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="adm-course">Course Interested *</label>
                    <select
                      id="adm-course" name="course" value={form.course} onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                    >
                      <option value="">Select Course</option>
                      {courseOptions.map((opt, i) => (
                        <option key={i} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="adm-city">Preferred City *</label>
                    <input
                      id="adm-city" name="city" value={form.city} onChange={handleChange}
                      required placeholder="Your city"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1" htmlFor="adm-msg">Message</label>
                  <textarea
                    id="adm-msg" name="message" value={form.message} onChange={handleChange}
                    rows={3} placeholder="Any specific query..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  id="admission-submit-btn"
                  disabled={loading}
                  className="w-full shimmer-btn text-white py-3 rounded-xl font-bold text-base hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : "Submit Enquiry →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
