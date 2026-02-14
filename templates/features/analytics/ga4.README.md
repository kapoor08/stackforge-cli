# Analytics (Google Analytics 4)

Google Analytics 4 integration for web analytics.

## Setup

1. Create a GA4 property in Google Analytics
2. Get your Measurement ID
3. Add to `.env`:
   ```
   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Usage

See `src/lib/ga4.ts` for the analytics client implementation.

## Documentation

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
