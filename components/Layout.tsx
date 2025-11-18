"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { AdUnit } from "./AdUnit"
import { PreferencesModal } from "./PreferencesModal"
import { AuthModal } from "./AuthModal"
import { FaMoon, FaHeart, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa"

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login")

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const navClasses = isHomePage && !isScrolled
    ? "fixed top-0 left-0 right-0 z-50 bg-transparent border-transparent backdrop-blur-sm transition-all duration-300"
    : "bg-card-bg border-b border-border-color shadow-sm transition-all duration-300"

  const logoClasses = isHomePage && !isScrolled
    ? "text-2xl font-bold text-white flex items-center gap-2 transition-colors drop-shadow-lg"
    : "text-2xl font-bold text-accent-purple flex items-center gap-2 transition-colors"

  const linkClasses = isHomePage && !isScrolled
    ? "text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md"
    : "text-foreground/80 hover:text-accent-purple px-3 py-2 rounded-md text-sm font-medium transition-colors"

  return (
    <div className="min-h-screen bg-background transition-colors">
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className={logoClasses}>
                <FaMoon className={isHomePage && !isScrolled ? "text-accent-purple drop-shadow-lg" : "text-accent-purple"} />
                Bedtime Stories
              </Link>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              {user ? (
                <>
                  {user.isPaid && (
                    <Link
                      href="/stories"
                      className={linkClasses + " hidden sm:block"}
                    >
                      Stories
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className={linkClasses + " flex items-center gap-2"}
                  >
                    <FaUser />
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className={isHomePage && !isScrolled 
                        ? "text-white hover:text-accent-purple px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md"
                        : "text-accent-purple hover:text-accent-purple-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className={linkClasses}
                    title="Sign Out"
                  >
                    <FaSignOutAlt className="sm:hidden" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthModalMode("login")
                      setIsAuthModalOpen(true)
                    }}
                    className={linkClasses}
                  >
                    Sign In
                  </button>
                  {isHomePage ? (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all drop-shadow-lg"
                    >
                      Get Started
                    </button>
                  ) : (
                    <Link
                      href="/onboarding/preferences"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all drop-shadow-lg"
                    >
                      Get Started
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isHomePage ? (
        <main className="w-full">
          {children}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      )}
      <footer className={`${isHomePage ? 'bg-gradient-to-b from-purple-900/50 to-purple-950/70' : 'bg-card-bg border-t border-border-color'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-center md:text-left ${isHomePage ? 'text-white/90' : 'text-foreground/70'} text-sm flex items-center justify-center gap-2`}>
              © {new Date().getFullYear()} Bedtime Stories. Made with <FaHeart className="text-red-500" /> for families.
            </p>
            {isHomePage && (
              <div className="flex items-center gap-6">
                <Link href="#how-it-works" className="text-white/80 hover:text-white text-sm transition-colors">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-white/80 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
                <Link href="#features" className="text-white/80 hover:text-white text-sm transition-colors">
                  Features
                </Link>
              </div>
            )}
          </div>
        </div>
      </footer>
      
      {isHomePage && <PreferencesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
    </div>
  )
}

