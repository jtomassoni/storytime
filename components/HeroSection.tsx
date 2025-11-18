"use client"

import { useState } from "react"
import { FaMoon } from "react-icons/fa"
import { PreferencesModal } from "./PreferencesModal"
import { AuthModal } from "./AuthModal"
import { formatYearlyPrice } from "@/lib/formatPrice"

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('how-it-works')
    if (element) {
      // Scroll far enough down to completely hide the hero section
      // The hero is full-screen (h-screen), so we need to scroll past the viewport height
      const navHeight = 64
      const viewportHeight = window.innerHeight
      
      // Calculate the element's position relative to the document
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset
      
      // Ensure we scroll at least past the hero section (viewport height)
      // This guarantees the hero is completely out of view
      const minScrollToClearHero = viewportHeight - navHeight
      const scrollToElement = elementTop - navHeight
      
      // Use whichever is greater to ensure hero is hidden
      const scrollPosition = Math.max(minScrollToClearHero, scrollToElement)
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <section className="hero-section relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden">
        {/* Elegant gradient overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        
        {/* Subtle animated stars effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        </div>
        
        {/* Content - optimized for above the fold */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          {/* Logo and Title - more compact and elegant */}
          <div className="mb-5 md:mb-6">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-5">
              <FaMoon className="text-5xl md:text-6xl lg:text-7xl text-accent-purple drop-shadow-2xl animate-pulse" style={{ animationDuration: '4s' }} />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl tracking-tight leading-tight">
                Bedtime Stories
              </h1>
            </div>
            
            {/* Tagline - refined typography */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-3 md:mb-4 max-w-4xl mx-auto font-light drop-shadow-lg leading-relaxed">
              A new story every day, personalized for your child
            </p>
            
            {/* Value proposition - elegant and concise */}
            <p className="text-base md:text-lg lg:text-xl text-white/85 mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-md font-light leading-relaxed">
              Starting at {formatYearlyPrice()} per year. No ads. No hassle. Just beautiful stories that help your little one drift off to sleep.
            </p>
          </div>

          {/* CTA Buttons - prominent and elegant */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 md:mb-5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 md:px-12 py-3.5 md:py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 text-base md:text-lg w-full sm:w-auto drop-shadow-2xl border-2 border-transparent hover:border-white/20"
            >
              Get a Story Preview
            </button>
            <a
              href="#how-it-works"
              onClick={handleLearnMoreClick}
              className="group bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-10 md:px-12 py-3.5 md:py-4 rounded-2xl font-semibold hover:bg-white/20 hover:border-white/60 transform hover:scale-105 transition-all duration-300 text-base md:text-lg w-full sm:w-auto drop-shadow-lg"
            >
              Learn More
            </a>
          </div>
          
          {/* Sign in link - subtle and refined */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-white/70 hover:text-white/90 text-sm md:text-base drop-shadow-md transition-colors duration-200 inline-block"
          >
            Already have an account? <span className="underline decoration-white/50 hover:decoration-white/90">Sign in</span>
          </button>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hero-section {
          background-image: url(/mobilehero.png);
        }
        @media (min-width: 768px) {
          .hero-section {
            background-image: url(/desktophero.png);
          }
        }
      `}} />

      <PreferencesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="login"
      />
    </>
  )
}

