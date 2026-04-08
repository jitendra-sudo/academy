"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "students", label: "Students", icon: "👥" },
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "admissions", label: "Admissions", icon: "📝" },
  { id: "faculty", label: "Faculty", icon: "👨‍🏫" },
  { id: "results", label: "Results", icon: "🏆" },
  { id: "payments", label: "Payments", icon: "💰" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const stats = [
  { label: "Total Students", value: "12,450", change: "+8.2%", trend: "up", color: "bg-blue-500", icon: "👥" },
  { label: "Active Courses", value: "34", change: "+3", trend: "up", color: "bg-green-500", icon: "📚" },
  { label: "Pending Admissions", value: "187", change: "-12", trend: "down", color: "bg-amber-500", icon: "📝" },
  { label: "Revenue (Month)", value: "₹24.5L", change: "+15%", trend: "up", color: "bg-purple-500", icon: "💰" },
];

const recentAdmissions = [
  { id: "ADM001", name: "Priya Sharma", course: "UPSC Foundation 2026", city: "Chennai", status: "Confirmed", date: "Apr 8, 2026" },
  { id: "ADM002", name: "Rahul Gupta", course: "Prelims Test Series 2026", city: "Delhi", status: "Pending", date: "Apr 7, 2026" },
  { id: "ADM003", name: "Ananya Nair", course: "TNPSC Group I", city: "Thiruvananthapuram", status: "Confirmed", date: "Apr 7, 2026" },
  { id: "ADM004", name: "Arjun Kumar", course: "UPSC Optional 2026", city: "Bengaluru", status: "Under Review", date: "Apr 6, 2026" },
  { id: "ADM005", name: "Meena Devi", course: "Mains Test Series", city: "Chennai", status: "Confirmed", date: "Apr 6, 2026" },
  { id: "ADM006", name: "Suresh R", course: "TNPSC Group II/IIA", city: "Madurai", status: "Pending", date: "Apr 5, 2026" },
];

const toppersByYear = [
  { name: "Rajeshwari Suve M", rank: "AIR 02", year: "2025", batch: "Naan Mudhalvan" },
  { name: "AR Rajah Mohaideen", rank: "AIR 07", year: "2025", batch: "GS Prelims Mains" },
  { name: "Rajkrishna Jha", rank: "AIR 08", year: "2024", batch: "Civilisation" },
  { name: "Ishita Kishore", rank: "AIR 01", year: "2022", batch: "Civilisation" },
];

const statusColor = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
};

export default function AdminSidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, onLogout }) {
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] z-30 transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">M</span>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-none">MENTORS MERITS</div>
              <div className="text-amber-400 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${activeSection === item.id
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {item.id === "admissions" && (
                <span className="ml-auto bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">187</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
          >
            ← Back to Website
          </Link>
          <button
            id="admin-logout-sidebar-btn"
            onClick={onLogout}
            className="flex items-center gap-2 text-red-300 hover:text-red-200 text-sm transition-colors w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    if (!isAuth) {
      router.replace("/admin/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[#1e3a8a]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-500 text-sm">Checking authentication...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              id="admin-sidebar-toggle"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-black text-gray-900 text-lg capitalize">
                {menuItems.find((m) => m.id === activeSection)?.icon} {activeSection}
              </h1>
              <p className="text-gray-500 text-xs">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
            </div>
            <button
              id="admin-logout-header-btn"
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-lg`}>
                        {s.icon}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                        {s.change}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{s.value}</div>
                    <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent + Toppers */}
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Recent Admissions */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-black text-gray-900">Recent Admissions</h2>
                    <button
                      className="text-[#1e3a8a] text-sm font-semibold hover:underline"
                      onClick={() => setActiveSection("admissions")}
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold">Student</th>
                          <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold hidden md:table-cell">Course</th>
                          <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold hidden lg:table-cell">City</th>
                          <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentAdmissions.map((a) => (
                          <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-semibold text-gray-900">{a.name}</div>
                              <div className="text-gray-400 text-xs">{a.id} · {a.date}</div>
                            </td>
                            <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{a.course}</td>
                            <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{a.city}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[a.status]}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Toppers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-black text-gray-900">🏆 Recent Toppers</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    {toppersByYear.map((t) => (
                      <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                          {t.rank.split(" ")[1]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-sm truncate">{t.name}</div>
                          <div className="text-amber-600 text-xs font-semibold">{t.rank} · UPSC {t.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Add Student", icon: "➕", color: "bg-blue-600", section: "students" },
                  { label: "New Course", icon: "📚", color: "bg-green-600", section: "courses" },
                  { label: "Record Payment", icon: "💳", color: "bg-purple-600", section: "payments" },
                  { label: "View Reports", icon: "📈", color: "bg-rose-600", section: "reports" },
                ].map((action) => (
                  <button
                    key={action.label}
                    id={`quick-action-${action.section}`}
                    onClick={() => setActiveSection(action.section)}
                    className={`${action.color} text-white rounded-2xl p-5 flex items-center gap-3 hover:opacity-90 hover:-translate-y-1 transition-all text-left shadow-md`}
                  >
                    <span className="text-3xl">{action.icon}</span>
                    <span className="font-bold">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection !== "dashboard" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-3">{menuItems.find((m) => m.id === activeSection)?.icon}</div>
              <h2 className="text-xl font-black text-gray-900 mb-2 capitalize">{activeSection} Management</h2>
              <p className="text-gray-500 mb-6">This section is under development. Full CRUD features coming soon.</p>
              <button
                onClick={() => setActiveSection("dashboard")}
                className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
