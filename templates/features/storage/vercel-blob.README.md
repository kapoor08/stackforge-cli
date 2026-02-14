# File Storage (Vercel Blob)

Vercel Blob integration for serverless file storage.

## Setup

1. Enable Blob storage in your Vercel project
2. Get your token from Vercel dashboard
3. Add to `.env`:
   ```
   BLOB_READ_WRITE_TOKEN=your_token
   ```

## Usage

See `src/lib/vercel-blob.ts` for the storage client implementation.

## Documentation

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
