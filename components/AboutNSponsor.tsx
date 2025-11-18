"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const bgImage = "/assets/logos/bg.png";

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    if (!section || !bg || !title || !content) return;

    gsap.set(bg, { clipPath: "inset(0 35% 0 35%)" });
    gsap.set(title, { opacity: 0, x: -200 });
    gsap.set(content, { opacity: 0, x: 200 });

    const reveal = { side: 35 };

    gsap.to(reveal, {
      side: 0,
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        end: "bottom -50%",
        scrub: 1,
      },
      ease: "power3.out",
      onUpdate: () => {
        const v = reveal.side + "%";
        bg.style.clipPath = `inset(0 ${v} 0 ${v})`;
      },
    });

    gsap.to([title, content], {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom -40%",
        scrub: 1,
      },
    });

    gsap.to([title, content], {
      scrollTrigger: {
        trigger: section,
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: 1,
      },
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power2.out",
    });

    ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      endTrigger: ".sponsors-section",
      end: "bottom bottom",
      pin: bg,
      pinSpacing: false,
    });

    gsap.to(bg, {
      scrollTrigger: {
        trigger: ".sponsors-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
      opacity: 0,
      scale: 1.05,
      ease: "none",
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`relative min-h-screen w-full overflow-hidden ${
        isVisible ? "animate-[fadeInSmooth_1s_ease-out]" : "opacity-0"
      }`}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full min-h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <h1
          ref={titleRef}
          className={`text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight max-w-2xl ${
            isVisible ? "title-animate" : "opacity-0"
          }`}
        >
          About Us
        </h1>

        <div
          ref={contentRef}
          className={`text-white text-lg md:text-xl leading-relaxed max-w-xl self-end text-right ${
            isVisible ? "content-animate" : "opacity-0"
          }`}
        >
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p>Suspendisse potenti. Mauris venenatis lorem in dui viverra.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInSmooth {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .title-animate {
          animation: slideLeft 0.8s ease-out;
        }
        .content-animate {
          animation: slideRight 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

interface Sponsor {
  name: string;
  logo: string;
}

const sponsors: Sponsor[] = Array.from({ length: 17 }, (_, i) => {
  const num = i + 50;
  return {
    name: `Sponsor ${num}`,
    logo: `/assets/logos/image ${num}.png`,
  };
});

const SponsorsGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;
    if (!section || !title || !grid) return;

    const cards = grid.querySelectorAll(".sponsor-card");

    gsap.set(title, { opacity: 0, y: 50 });
    gsap.set(cards, { opacity: 0, y: 30, scale: 0.9 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "top 10%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    }).to(
      cards,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
      },
      "-=0.4"
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const columns = 3;
  const fullRowsCount = Math.floor(sponsors.length / columns);
  const itemsInLastRow = sponsors.length % columns;
  const fullRows = sponsors.slice(0, fullRowsCount * columns);
  const lastRow = sponsors.slice(fullRowsCount * columns);

  return (
    <>
      <div
        ref={sectionRef}
        className="sponsors-section min-h-screen py-16 px-4 relative"
        style={{
          background: "transparent",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold text-white text-center mb-16"
          >
            Sponsors
          </h1>

          <div ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fullRows.map((sponsor, index) => (
                <div
                  key={index}
                  className="sponsor-card bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 flex items-center justify-center hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>

            {itemsInLastRow > 0 && (
              <div className="flex justify-center gap-6 mt-6">
                {lastRow.map((sponsor, index) => (
                  <div
                    key={`last-${index}`}
                    className="sponsor-card bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 flex items-center justify-center hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ height: "20vh" }} />
        </div>
      </div>

      <div className="sponsors-end-marker h-[1px]" />
    </>
  );
};

const AboutNSponsor = () => {
  return (
    <div className="bg-black">
      <AboutUs />
      <SponsorsGrid />
    </div>
  );
};

export default AboutNSponsor;