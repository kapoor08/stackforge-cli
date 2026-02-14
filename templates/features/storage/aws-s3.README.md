# File Storage (AWS S3)

Amazon S3 integration for file uploads and storage.

## Setup

1. Create an S3 bucket in AWS Console
2. Configure IAM credentials with S3 access
3. Add to `.env`:
   ```
   AWS_S3_BUCKET=your-bucket-name
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

## Usage

See `src/lib/aws-s3.ts` for the storage client implementation.

## Documentation

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
