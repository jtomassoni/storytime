/**
 * Centralized pricing configuration for Bedtime Stories app
 * Supports environment variables for easy deployment configuration
 */

export const PRICING = {
  monthly: parseFloat(process.env.NEXT_PUBLIC_MONTHLY_PRICE || "3.99"),
  yearly: parseFloat(process.env.NEXT_PUBLIC_YEARLY_PRICE || "19"),
  currency: "USD",
  foundersPlanEnabled: process.env.NEXT_PUBLIC_FOUNDERS_PLAN_ENABLED === "true",
  foundersPrice: parseFloat(process.env.NEXT_PUBLIC_FOUNDERS_PRICE || "5"),
} as const

/**
 * Calculate savings percentage when choosing yearly over monthly
 */
export function getYearlySavings(): number {
  const monthlyYearlyTotal = PRICING.monthly * 12
  const savings = monthlyYearlyTotal - PRICING.yearly
  return Math.round((savings / monthlyYearlyTotal) * 100)
}

/**
 * Get Stripe plan IDs from environment variables
 */
export const STRIPE_PLANS = {
  monthly: process.env.STRIPE_MONTHLY_PLAN_ID || "",
  yearly: process.env.STRIPE_YEARLY_PLAN_ID || "",
  founders: process.env.STRIPE_FOUNDERS_PLAN_ID || "",
} as const

/**
 * Convert price to Stripe unit amount (cents)
 */
export function priceToCents(price: number): number {
  return Math.round(price * 100)
}

