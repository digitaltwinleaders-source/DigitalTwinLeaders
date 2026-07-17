import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

export async function getPublishedSlugs(): Promise<{ slug: string }[]> {
  try {
    const app = initializeApp(environment.firebase, 'prerender');
    const db = getFirestore(app);
    const q = query(
      collection(db, 'blogs'),
      where('published', '==', true)
    );
    const snapshot = await getDocs(q);
    const slugs = snapshot.docs
      .map(doc => doc.data()['slug'])
      .filter((slug): slug is string => !!slug);
    return slugs.map(slug => ({ slug }));
  } catch (error) {
    console.warn('Failed to fetch blog slugs for prerendering:', error);
    return [];
  }
}
