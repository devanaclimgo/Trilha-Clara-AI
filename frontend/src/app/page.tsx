import CTASection from "@/components/CTASection";
import FeaturesGrid from "@/components/FeaturesGrid";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
    <div className="container mx-auto px-4 py-16">
      <Hero />

      <FeaturesGrid />

      <CTASection />
    </div>
  </div>
  );
}
