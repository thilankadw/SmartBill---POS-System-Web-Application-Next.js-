import Features from "@/app/components/client/features";
import Footer from "@/app/components/client/footer";
import Hero from "@/app/components/client/hero";
import MobilePOSSection from "@/app/components/client/mobileplatform";
import Testimonials from "@/app/components/client/testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <MobilePOSSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
