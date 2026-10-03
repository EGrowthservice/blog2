import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

async function checkAndFixIndexes() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('No database handle');
    process.exit(1);
  }

  const collections = await db.listCollections().toArray();
  console.log(`Found ${collections.length} collections:`, collections.map(c => c.name));

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const col = db.collection(colName);
    const indexes = await col.indexes();
    console.log(`\nIndexes for collection [${colName}]:`);
    for (const idx of indexes) {
      console.log(`  - name: ${idx.name}, key: ${JSON.stringify(idx.key)}, unique: ${idx.unique}`);
      if (idx.name === 'id_1' || (idx.key && idx.key.id && idx.unique)) {
        console.log(`    ⚠️ Found problematic index: ${idx.name}. Dropping...`);
        if (idx.name) {
          try {
            await col.dropIndex(idx.name);
            console.log(`    ✅ Successfully dropped ${idx.name} on ${colName}!`);
          } catch (err: any) {
            console.error(`    ❌ Error dropping index ${idx.name}:`, err.message);
          }
        }
      }
    }
  }

  console.log('\nFinished inspecting and fixing indexes.');
  await mongoose.disconnect();
}

checkAndFixIndexes().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
