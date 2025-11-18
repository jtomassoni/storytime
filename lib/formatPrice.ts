import { PRICING } from "./pricing"

/**
 * Format a price value as USD currency string
 * @param price - The price value (e.g., 3.99, 19)
 * @param options - Intl.NumberFormat options
 * @returns Formatted price string (e.g., "$3.99", "$19.00")
 */
export function formatPrice(
  price: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: PRICING.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(price)
}

/**
 * Format monthly price
 */
export function formatMonthlyPrice(): string {
  return formatPrice(PRICING.monthly)
}

/**
 * Format yearly price
 */
export function formatYearlyPrice(): string {
  return formatPrice(PRICING.yearly)
}

/**
 * Format founders price
 */
export function formatFoundersPrice(): string {
  return formatPrice(PRICING.foundersPrice)
}

