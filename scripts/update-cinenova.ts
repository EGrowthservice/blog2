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

async function checkAndFixAllSettings() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;
  const settingsColl = db.collection('settings');

  const all = await settingsColl.find({}).toArray();
  console.log('ALL DOCS COUNT:', all.length);
  for (const doc of all) {
    console.log(`Doc ID: ${doc._id}, key: ${doc.key}, siteName: ${doc.siteName}`);
  }

  // Update ALL docs in settings
  await settingsColl.updateMany({}, {
    $set: {
      siteName: 'CineNova',
      siteUrl: 'https://cinenova.click',
      tagline: 'Entertainment, Sports & Cinema Magazine',
      defaultMetaTitle: 'CineNova - Entertainment, Sports & Cinema Magazine',
      defaultMetaDescription: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
      description: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
      footerText: '© 2026 CineNova. All rights reserved. Delivering premier reporting across Entertainment, Sports, and Movies.',
      contactEmail: 'contact@cinenova.click',
    }
  });

  // Also ensure global_settings exists if it doesn't
  const globalDoc = await settingsColl.findOne({ key: 'global_settings' });
  if (!globalDoc) {
    console.log('Inserting default global_settings...');
    await settingsColl.insertOne({
      key: 'global_settings',
      siteName: 'CineNova',
      siteUrl: 'https://cinenova.click',
      tagline: 'Entertainment, Sports & Cinema Magazine',
      defaultMetaTitle: 'CineNova - Entertainment, Sports & Cinema Magazine',
      defaultMetaDescription: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
      description: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
      footerText: '© 2026 CineNova. All rights reserved. Delivering premier reporting across Entertainment, Sports, and Movies.',
      contactEmail: 'contact@cinenova.click',
      favicon: '/avt.png',
      logo: '/avt.png',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } else {
    await settingsColl.updateOne({ key: 'global_settings' }, {
      $set: {
        siteName: 'CineNova',
        siteUrl: 'https://cinenova.click',
        tagline: 'Entertainment, Sports & Cinema Magazine',
        defaultMetaTitle: 'CineNova - Entertainment, Sports & Cinema Magazine',
        defaultMetaDescription: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
        description: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
        footerText: '© 2026 CineNova. All rights reserved. Delivering premier reporting across Entertainment, Sports, and Movies.',
        contactEmail: 'contact@cinenova.click',
        updatedAt: new Date()
      }
    });
  }

  console.log('Done syncing MongoDB settings!');
  await mongoose.disconnect();
}

checkAndFixAllSettings().catch(console.error);
