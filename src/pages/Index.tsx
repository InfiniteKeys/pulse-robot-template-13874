import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MathTimelineSection from "@/components/MathTimelineSection";
import EventsSection from "@/components/EventsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FAQSection from "@/components/ui/faq-section";
import ScrollIndicator from "@/components/ScrollIndicator";

const Index = () => {
  return (
    <div className="min-h-screen relative with-floating-nav">
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <ScrollIndicator />
        <AboutSection />
        <MathTimelineSection />
        <EventsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
