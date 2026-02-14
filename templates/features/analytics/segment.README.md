# Analytics (Segment)

Segment analytics integration for customer data platform.

## Setup

1. Sign up at [Segment](https://segment.com)
2. Create a source and get your Write Key
3. Add to `.env`:
   ```
   NEXT_PUBLIC_SEGMENT_WRITE_KEY=your_write_key
   ```

## Usage

See `src/lib/segment.ts` for the analytics client implementation.

## Documentation

- [Segment Analytics.js](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/)
