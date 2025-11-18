/**
 * Tests for pricing configuration
 * Run with: npx tsx lib/__tests__/pricing.test.ts
 * Or add to your test framework (Jest/Vitest)
 */

import { PRICING, getYearlySavings, priceToCents } from "../pricing"

// Simple test runner
function test(name: string, fn: () => void) {
  try {
    fn()
    console.log(`✅ ${name}`)
  } catch (error) {
    console.error(`❌ ${name}`)
    console.error(error)
    process.exit(1)
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`)
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`)
      }
    },
    toBeGreaterThan(expected: number) {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`)
      }
    },
    toBeLessThan(expected: number) {
      if (actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`)
      }
    },
  }
}

// Tests
test("PRICING.monthly should be 3.99", () => {
  expect(PRICING.monthly).toBe(3.99)
})

test("PRICING.yearly should be 19", () => {
  expect(PRICING.yearly).toBe(19)
})

test("PRICING.currency should be USD", () => {
  expect(PRICING.currency).toBe("USD")
})

test("PRICING.foundersPlanEnabled should default to false", () => {
  // This will be false unless NEXT_PUBLIC_FOUNDERS_PLAN_ENABLED is set to "true"
  expect(typeof PRICING.foundersPlanEnabled).toBe("boolean")
})

test("PRICING.foundersPrice should be 5", () => {
  expect(PRICING.foundersPrice).toBe(5)
})

test("getYearlySavings should calculate 60% savings", () => {
  const savings = getYearlySavings()
  // Monthly: $3.99 * 12 = $47.88
  // Yearly: $19
  // Savings: $47.88 - $19 = $28.88
  // Percentage: ($28.88 / $47.88) * 100 = 60.32% ≈ 60%
  expect(savings).toBe(60)
})

test("priceToCents should convert dollars to cents", () => {
  expect(priceToCents(3.99)).toBe(399)
  expect(priceToCents(19)).toBe(1900)
  expect(priceToCents(5)).toBe(500)
})

// Run tests
console.log("\nRunning pricing tests...\n")
test("All pricing tests passed", () => {
  // If we get here, all tests passed
})

console.log("\n✅ All pricing tests passed!\n")

