"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { 
  FileText, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight
} from "lucide-react";

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

    // Listen for plan selection from MentorshipPricing
    const handleSelectPlan = (e) => {
      setForm((prev) => ({ ...prev, course: e.detail }));
    };
    window.addEventListener("selectPlan", handleSelectPlan);
    return () => window.removeEventListener("selectPlan", handleSelectPlan);
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
      { label: "Essential Mentorship", cat: "Mentorship" },
      { label: "Premium Mentorship", cat: "Mentorship" },
      { label: "Platinum Mentorship", cat: "Mentorship" },
      { label: "UPSC Foundation Course", cat: "UPSC" },
      { label: "UPSC Prelims Test Series", cat: "UPSC" },
      { label: "TNPSC Group I & II", cat: "TNPSC" },
    ];

  return (
    <>

      {/* Admission Form */}
      <section className="py-20 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8]" id="admission">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left info */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <FileText size={16} /> Admission 2026
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
                  { icon: <Phone size={18} className="text-amber-400" />, text: ` ${upscPhone}` },
                  { icon: <Mail size={18} className="text-amber-400" />, text: admissionEmail },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-lg">{c.icon}</div>
                    <span className="text-blue-100 font-bold">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-black text-gray-900 mb-6">Admission Consultation</h3>
              {submitted && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm font-medium flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Thank you! Your enquiry {submittedId ? `(ID: ${submittedId})` : ""} has been received. We&apos;ll contact you within 24 hours.</span>
                </div>
              )}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm font-medium flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
