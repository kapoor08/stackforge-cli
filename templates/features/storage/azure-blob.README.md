# File Storage (Azure Blob Storage)

Azure Blob Storage integration for file uploads.

## Setup

1. Create a storage account in Azure Portal
2. Get your connection string
3. Add to `.env`:
   ```
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   ```

## Usage

See `src/lib/azure-blob.ts` for the storage client implementation.

## Documentation

- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
