"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

export interface GridImage {
  id: string
  src: string
  alt: string
  label?: string
}

interface ImageGridProps {
  title: string
  images: GridImage[]
  backgroundImage?: string
}

gsap.registerPlugin(ScrollTrigger)

export function TeamGrid({ title, images, backgroundImage }: ImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !backgroundRef.current || !contentRef.current) return

    // ensure content hidden initially
    gsap.set(contentRef.current, { y: "100%", opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 8%",
        end: "bottom center",
        scrub: 1,
        pin: true,
        // markers: true,
      },
    })

    // BACKGROUND: start scaled down at bottom center and grow -> move up to final placement
    // transformOrigin bottom-center so it "grows up" naturally
    gsap.set(backgroundRef.current, { transformOrigin: "50% 100%", willChange: "transform" })

    tl.fromTo(
      backgroundRef.current,
      {
        y: "120%",        // start well below the viewport
        scale: 0.22,      // start small
      },
      {
        y: "0%",          // end at natural position
        scale: 1,         // end at normal size (matches your original layout)
        duration: 1,
        ease: "none",     // linear mapping with scrub ensures 1:1 feel with scroll
      },
      0
    )

    // label: background finished
    tl.addLabel("bgDone")

    // CONTENT: reveal only after background completes
    tl.to(
      contentRef.current,
      { y: "0%", opacity: 1, duration: 1, ease: "power3.out" },
      "bgDone"
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-[90vw] h-[80vh] flex items-center justify-center relative overflow-hidden mx-auto"
    >
      {/* Background image container - matches your original final styling */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          willChange: "transform",
        }}
      />

      {/* Content wrapper - stays hidden until bg finishes */}
      <div
        ref={contentRef}
        className="relative z-10 w-full flex flex-col items-center justify-center"
      >
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl grover-font font-bold text-white text-center mb-12 md:mb-16">
          {title}
        </h1>

        {/* Images Grid */}
        <div className="w-full max-w-6xl">
          <div
            className="grid gap-4 sm:gap-6 md:gap-8 sm:grid"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
            }}
          >
            {images.map((image) => (
              <div key={image.id} className="flex flex-col items-center gap-3 sm:gap-4">
                {/* Image Container */}
                <div className="w-full max-w-[350px] max-h-[350px] aspect-square rounded-2xl overflow-hidden bg-gray-400 shadow-lg hover:shadow-xl transition-shadow">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover sm:h-2xl sm:w-xl"
                    priority={false}
                  />
                </div>

                {/* Label */}
                {image.label && (
                  <p className="text-lg sm:text-xl md:text-2xl font-medium text-white text-center">{image.label}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamGrid
