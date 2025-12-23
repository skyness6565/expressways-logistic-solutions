import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Anchor, Truck, Plane, Warehouse, PackageCheck } from "lucide-react";

import heroOcean from "@/assets/hero-ocean.jpg";
import heroLand from "@/assets/hero-land.jpg";
import heroAir from "@/assets/hero-air.jpg";
import heroWarehouse from "@/assets/hero-warehouse.jpg";
import heroDelivery from "@/assets/hero-delivery.jpg";

interface ServiceSectionProps {
  onQuoteClick: () => void;
}

const services = [
  {
    id: "ocean",
    title: "Ocean Freight",
    subtitle: "Global Maritime Solutions",
    description: "Navigate global waters with confidence. Our ocean freight services offer cost-effective, reliable shipping for containers of all sizes across major ports worldwide.",
    features: ["FCL & LCL Options", "Real-Time Tracking", "Custom Clearance"],
    image: heroOcean,
    icon: Anchor,
    color: "from-ocean/90 to-navy/90",
  },
  {
    id: "land",
    title: "Land Transport",
    subtitle: "Cross-Country Excellence",
    description: "From highways to remote destinations, our fleet delivers your cargo safely and on time with comprehensive ground transportation solutions.",
    features: ["Full Truckload", "Less-Than-Truckload", "Express Delivery"],
    image: heroLand,
    icon: Truck,
    color: "from-amber-600/90 to-navy/90",
  },
  {
    id: "air",
    title: "Air Freight",
    subtitle: "Speed Meets Reliability",
    description: "When time is critical, trust our air freight services. We partner with major carriers to ensure your cargo reaches its destination in the fastest time possible.",
    features: ["Express Air", "Charter Services", "Door-to-Door"],
    image: heroAir,
    icon: Plane,
    color: "from-sky/90 to-navy/90",
  },
  {
    id: "warehouse",
    title: "Cargo Handling",
    subtitle: "Secure Storage Solutions",
    description: "State-of-the-art warehousing and cargo handling facilities equipped with modern technology for inventory management and distribution.",
    features: ["Climate Control", "Inventory Management", "Distribution Hub"],
    image: heroWarehouse,
    icon: Warehouse,
    color: "from-slate-600/90 to-navy/90",
  },
  {
    id: "delivery",
    title: "Customer Delivery",
    subtitle: "Last Mile Perfection",
    description: "The final step matters most. Our dedicated delivery teams ensure your packages reach customers' doorsteps with care and professionalism.",
    features: ["Same-Day Options", "White Glove Service", "Photo Confirmation"],
    image: heroDelivery,
    icon: PackageCheck,
    color: "from-emerald-600/90 to-navy/90",
  },
];

const ServiceSection = ({ onQuoteClick }: ServiceSectionProps) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div id="services">
      {services.map((service, index) => {
        const Icon = service.icon;
        const isVisible = visibleSections.has(service.id);
        const isEven = index % 2 === 0;

        return (
          <section
            key={service.id}
            id={service.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(service.id, el);
            }}
            className="relative min-h-screen flex items-center overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color}`} />
            </div>

            {/* Content */}
            <div className="relative z-10 container-wide section-padding">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div
                    className={`transition-all duration-700 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : isEven
                        ? "opacity-0 -translate-x-12"
                        : "opacity-0 translate-x-12"
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{service.subtitle}</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
                      {service.title}
                    </h2>

                    <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl">
                      {service.description}
                    </p>

                    <ul className="flex flex-wrap gap-3 mb-8">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-medium"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button variant="hero" size="xl" onClick={onQuoteClick}>
                      Get {service.title} Quote
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className={`hidden lg:block ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div
                    className={`transition-all duration-700 delay-200 ${
                      isVisible
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-64 h-64 mx-auto rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-32 h-32 text-accent" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-accent/30 animate-float" />
                      <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-accent/20 animate-float" style={{ animationDelay: "1s" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ServiceSection;
