# File Storage (Cloudflare R2)

Cloudflare R2 integration for S3-compatible file storage.

## Setup

1. Create an R2 bucket in Cloudflare dashboard
2. Generate API tokens
3. Add to `.env`:
   ```
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET=your-bucket-name
   ```

## Usage

See `src/lib/cloudflare-r2.ts` for the storage client implementation.

## Documentation

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
