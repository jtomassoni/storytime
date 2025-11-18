"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  
  // Parse the pathname to create breadcrumbs
  const segments = pathname.split("/").filter(Boolean)
  
  // Don't show breadcrumbs on the main admin page
  if (segments.length <= 1) {
    return null
  }

  const breadcrumbs = [
    { label: "Ecosystem Management", href: "/admin" },
  ]

  // Build breadcrumbs based on path
  if (segments[1] === "stories") {
    breadcrumbs.push({ label: "Stories", href: "/admin/stories" })
    
    if (segments[2] === "new") {
      breadcrumbs.push({ label: "New Story", href: "/admin/stories/new" })
    } else if (segments[2]) {
      breadcrumbs.push({ label: "Edit Story", href: `/admin/stories/${segments[2]}` })
    }
  } else if (segments[1] === "categories") {
    breadcrumbs.push({ label: "Categories", href: "/admin/categories" })
  } else if (segments[1] === "story-of-the-day") {
    breadcrumbs.push({ label: "Story of the Day", href: "/admin/story-of-the-day" })
  }

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && (
              <span className="text-foreground/40 mx-2">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground/90 font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-foreground/70 hover:text-accent-purple transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

