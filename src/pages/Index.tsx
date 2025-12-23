import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import TrackingSection from "@/components/TrackingSection";
import FAQSection from "@/components/FAQSection";
import QuoteModal from "@/components/QuoteModal";
import Footer from "@/components/Footer";
import JivoChat from "@/components/JivoChat";

const Index = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const scrollToTracking = () => {
    const trackingSection = document.getElementById("tracking");
    if (trackingSection) {
      trackingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onTrackClick={scrollToTracking}
        onQuoteClick={() => setIsQuoteModalOpen(true)}
      />
      
      <main>
        <HeroSection
          onTrackClick={scrollToTracking}
          onQuoteClick={() => setIsQuoteModalOpen(true)}
        />
        
        <ServiceSection onQuoteClick={() => setIsQuoteModalOpen(true)} />
        
        <TrackingSection />
        
        <FAQSection />
      </main>

      <Footer />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      <JivoChat />
    </div>
  );
};

export default Index;
