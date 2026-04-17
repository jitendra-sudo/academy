import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSlider from "./components/HeroSlider";
import CoursesSection from "./components/CoursesSection";
import AchievementsSection from "./components/AchievementsSection";
import AdmissionSection from "./components/AdmissionSection";
import HomepageLectures from "./components/HomepageLectures";
import WhatsAppFloat from "./components/WhatsAppFloat";
import AboutSection from "./components/AboutSection";
import MentorshipPricing from "./components/MentorshipPricing";
import MentorshipValue from "./components/MentorshipValue";
import WhyChooseUs from "./components/WhyChooseUs";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSlider />
      <AboutSection />
      <WhyChooseUs />
      <AchievementsSection />
      <MentorshipPricing />
      <MentorshipValue />
      <CoursesSection />
      <HomepageLectures />
      <AdmissionSection />
      <Footer />

      <WhatsAppFloat />
    </main>
  );
}
