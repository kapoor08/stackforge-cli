# Storage (Cloudinary)

## Setup
1. Add CLOUDINARY_URL to .env.
2. Configure Cloudinary in your app code as needed.

## Example
```ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ url: process.env.CLOUDINARY_URL });
```
