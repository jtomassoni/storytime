"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { AdUnit } from "./AdUnit"

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const user = session?.user

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                🌙 Bedtime Stories
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/favorites"
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Account
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Bedtime Stories. Made with ❤️ for families.
          </p>
        </div>
      </footer>
    </div>
  )
}

