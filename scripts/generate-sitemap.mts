import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
    apiKey: 'AIzaSyBZm330nB9225eKJuJvC9jUEllwJDHN13c',
    authDomain: 'digitaltwinleaders-233df.firebaseapp.com',
    projectId: 'digitaltwinleaders-233df',
    storageBucket: 'digitaltwinleaders-233df.firebasestorage.app',
    messagingSenderId: '1001706627486',
    appId: '1:1001706627486:web:8c29d43752ce5bd446f68f'
};

const baseUrl = 'https://www.digitaltwinleaders.com';

async function generate() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const q = query(collection(db, 'blogs'), where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  const today = new Date().toISOString().slice(0, 10);
  const toDate = (value: any): string => {
    if (!value) return today;
    const d = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
    return isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
  };

  const staticRoutes = ['/', '/blog', '/knowledge-hub', '/project-planner'].map(path => ({ path, lastmod: today }));
  const blogRoutes = snapshot.docs
    .map(doc => doc.data())
    .filter(data => !!data['slug'])
    .map(data => ({ path: `/blog/${data['slug']}`, lastmod: toDate(data['updatedAt'] || data['createdAt']) }));
  const allRoutes = [...staticRoutes, ...blogRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  const outPath = resolve(__dirname, '../dist/digital-twin-leaders/browser/sitemap.xml');
  writeFileSync(outPath, sitemap);
  console.log(`Sitemap generated with ${allRoutes.length} URLs`);
}

generate().catch(console.error);
