import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSlider from "./components/HeroSlider";
import CoursesSection from "./components/CoursesSection";
import AchievementsSection from "./components/AchievementsSection";
import AdmissionSection from "./components/AdmissionSection";
import HomepageLectures from "./components/HomepageLectures";
import WhatsAppFloat from "./components/WhatsAppFloat";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSlider />
      <AchievementsSection />
      <CoursesSection />
      <HomepageLectures />
      <AdmissionSection />
      <Footer />

      {/* WhatsApp Float Button */}
      <WhatsAppFloat />
    </main>
  );
}
