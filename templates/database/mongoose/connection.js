import mongoose from 'mongoose';

const MONGOOSE_URI = process.env.DATABASE_URL || '';

export async function connectMongoose() {
  if (!MONGOOSE_URI) {
    throw new Error('DATABASE_URL is not set');
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(MONGOOSE_URI);
}
