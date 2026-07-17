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
  const slugs = snapshot.docs.map(doc => doc.data()['slug']).filter(Boolean);

  const staticRoutes = ['/', '/blog', '/knowledge-hub', '/project-planner'];
  const blogRoutes = slugs.map((slug: string) => `/blog/${slug}`);
  const allRoutes = [...staticRoutes, ...blogRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  const outPath = resolve(__dirname, '../dist/digital-twin-leaders/browser/sitemap.xml');
  writeFileSync(outPath, sitemap);
  console.log(`Sitemap generated with ${allRoutes.length} URLs`);
}

generate().catch(console.error);
