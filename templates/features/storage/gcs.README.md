# File Storage (Google Cloud Storage)

Google Cloud Storage integration for file uploads.

## Setup

1. Create a GCS bucket in Google Cloud Console
2. Set up service account credentials
3. Add to `.env`:
   ```
   GCS_BUCKET=your-bucket-name
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```

## Usage

See `src/lib/gcs.ts` for the storage client implementation.

## Documentation

- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
