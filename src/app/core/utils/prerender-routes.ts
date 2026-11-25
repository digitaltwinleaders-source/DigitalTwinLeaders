import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

export async function getPublishedSlugs(): Promise<{ slug: string }[]> {
  try {
    const app = initializeApp(environment.firebase, 'prerender');
    const db = getFirestore(app);
    const q = query(
      collection(db, 'blogs'),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(q);
    const slugs = snapshot.docs
      .map(doc => doc.data()['slug'])
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
    return slugs.map(slug => ({ slug }));
  } catch (error) {
    console.error('Failed to fetch blog slugs for prerendering:', error);
    throw error;
  }
}
