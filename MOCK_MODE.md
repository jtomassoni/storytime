# Mock Mode for Testing

The app now includes a **mock mode** that allows you to test the subscription flow without needing real Stripe credentials or making actual payments.

## How It Works

Mock mode is automatically enabled when:
- `STRIPE_SECRET_KEY` is not set in your `.env` file, OR
- `USE_MOCK_STRIPE=true` is set in your `.env` file

## What Mock Mode Does

1. **Instant Subscription Activation**: When users click "Subscribe", their subscription is activated immediately without going through Stripe checkout
2. **No Payment Required**: No credit card needed - perfect for testing
3. **Full Functionality**: All subscription features work exactly as they would with real Stripe
4. **Visual Indicator**: A yellow banner appears on the home page indicating test mode is active

## Testing the Flow

1. **Register/Login** as a user
2. **Complete onboarding** (3 quick questions)
3. **Click "Subscribe" button** (choose monthly or yearly plan)
4. **Instantly redirected** to success page with active subscription
5. **Access all paid features** immediately

## Adding Sample Stories

To add sample stories for testing, make a POST request to `/api/test/sample-stories` (requires admin login):

```bash
# After logging in as admin, you can use the browser console or curl:
fetch('/api/test/sample-stories', { method: 'POST' })
```

This creates 3 sample bedtime stories that you can use to test the app.

## Switching to Real Stripe

When you're ready to use real Stripe:

1. Add `STRIPE_SECRET_KEY` to your `.env` file
2. Remove or set `USE_MOCK_STRIPE=false`
3. Restart your dev server
4. The app will automatically use real Stripe checkout

## Mock Mode Features

- ✅ Instant subscription activation
- ✅ Full subscription status tracking
- ✅ Subscription expiration dates (1 year from activation)
- ✅ All UI updates correctly
- ✅ No external dependencies needed

Perfect for development and testing! 🧪

