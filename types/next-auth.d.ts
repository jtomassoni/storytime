import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    role: UserRole
    isPaid: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: UserRole
      isPaid: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isPaid: boolean
  }
}

