import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let indexesCleaned = false;
async function cleanProblematicIndexes(m: typeof mongoose) {
  if (indexesCleaned || !m?.connection?.db) return;
  indexesCleaned = true;
  try {
    const db = m.connection.db;
    const collections = ['categories', 'posts', 'authors'];
    for (const name of collections) {
      try {
        const col = db.collection(name);
        const indexes = await col.indexes();
        if (indexes.some((idx: { name?: string }) => idx.name === 'id_1')) {
          await col.dropIndex('id_1');
          console.log(`✅ Automatically removed legacy id_1 index from ${name}`);
        }
      } catch {
        // Ignore if collection does not exist or index already dropped
      }
    }
  } catch {
    // Ignore db operation errors in cleanup
  }
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_blog';

  // Check if connection is already established and alive
  if (cached.conn && mongoose.connection.readyState === 1) {
    cleanProblematicIndexes(cached.conn).catch(() => {});
    return cached.conn;
  }

  // If connection dropped or in error state, reset cache
  if (cached.conn && mongoose.connection.readyState === 0) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined. Database operations will return empty states.');
    return null;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        cleanProblematicIndexes(m).catch(() => {});
        return m;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err?.message || err);
        cached.promise = null;
        cached.conn = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    if (cached.conn) {
      cleanProblematicIndexes(cached.conn).catch(() => {});
    }
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('❌ Failed to establish MongoDB connection:', e);
    return null;
  }

  return cached.conn;
}

export default connectDB;

