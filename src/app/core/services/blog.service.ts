import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  QueryDocumentSnapshot,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Blog } from '../models/blog.model';

const TIMEOUT_MS = 8000;
const PAGE_SIZE = 6;

@Injectable({ providedIn: 'root' })
export class BlogService {
  private firestore = inject(Firestore);
  private readonly COLLECTION = 'blogs';
  private allPublishedCache: Blog[] | null = null;

  // ── Admin ──────────────────────────────────────────────────────────────

  getAllBlogs(): Observable<Blog[]> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(ref, orderBy('createdAt', 'desc'));
    return (collectionData(q, { idField: 'id' }) as Observable<Blog[]>).pipe(
      timeout(TIMEOUT_MS)
    );
  }

  async getBlogById(id: string): Promise<Blog | null> {
    const ref = doc(this.firestore, `${this.COLLECTION}/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } as Blog : null;
  }

  async addBlog(blog: Omit<Blog, 'id'>): Promise<string> {
    const ref = collection(this.firestore, this.COLLECTION);
    const docRef = await addDoc(ref, {
      ...blog,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateBlog(id: string, data: Partial<Blog>): Promise<void> {
    const ref = doc(this.firestore, `${this.COLLECTION}/${id}`);
    await updateDoc(ref, { ...data, updatedAt: Timestamp.now() });
  }

  async deleteBlog(id: string): Promise<void> {
    const ref = doc(this.firestore, `${this.COLLECTION}/${id}`);
    await deleteDoc(ref);
  }

  // ── Public ─────────────────────────────────────────────────────────────

  getFeaturedBlog(): Observable<Blog | null> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(
      ref,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    return (collectionData(q, { idField: 'id' }) as Observable<Blog[]>).pipe(
      timeout(TIMEOUT_MS),
      map(blogs => blogs[0] || null)
    );
  }

  getRecentBlogs(count = 4, excludeId?: string): Observable<Blog[]> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(
      ref,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(count + 1) // fetch one extra in case we need to filter out the featured post
    );
    return (collectionData(q, { idField: 'id' }) as Observable<Blog[]>).pipe(
      timeout(TIMEOUT_MS),
      map(blogs => {
        const filtered = excludeId ? blogs.filter(b => b.id !== excludeId) : blogs;
        return filtered.slice(0, count);
      })
    );
  }

  async getAllPublishedForSearch(): Promise<Blog[]> {
    if (this.allPublishedCache) return this.allPublishedCache;

    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(ref, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    this.allPublishedCache = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Blog);
    return this.allPublishedCache;
  }

  getCategories(): Observable<string[]> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(ref, where('status', '==', 'published'));
    return (collectionData(q) as Observable<Blog[]>).pipe(
      timeout(TIMEOUT_MS),
      map(blogs => [...new Set(blogs.map(b => b.category).filter(Boolean))].sort())
    );
  }

  async getPublishedPage(
    lastDoc?: QueryDocumentSnapshot,
    category?: string,
    excludeId?: string
  ): Promise<{ blogs: Blog[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    const ref = collection(this.firestore, this.COLLECTION);
    const constraints: any[] = [
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE + 2) // a little extra buffer in case we filter one out
    ];

    if (category) constraints.splice(1, 0, where('category', '==', category));
    if (lastDoc) constraints.push(startAfter(lastDoc));

    const snap = await getDocs(query(ref, ...constraints));
    let docs = snap.docs;

    if (excludeId && !lastDoc) {
      // Only filter on the first page — featured post is always the most recent
      docs = docs.filter(d => d.id !== excludeId);
    }

    const hasMore = docs.length > PAGE_SIZE;
    const pageDocs = hasMore ? docs.slice(0, PAGE_SIZE) : docs;

    return {
      blogs: pageDocs.map(d => ({ id: d.id, ...d.data() }) as Blog),
      lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] as QueryDocumentSnapshot : null,
      hasMore
    };
  }

  // blog.service.ts
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(
      ref,
      where('slug', '==', slug),
      where('status', '==', 'published'),  // ← required so Firestore can verify the rule against the query itself
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Blog;
  }

  async getAdjacentBlogs(createdAt: any): Promise<{ prev: Blog | null; next: Blog | null }> {
    const ref = collection(this.firestore, this.COLLECTION);
    const base = [where('status', '==', 'published')];

    const [prevSnap, nextSnap] = await Promise.all([
      getDocs(query(ref, ...base, orderBy('createdAt', 'desc'), startAfter(createdAt), limit(1))),
      getDocs(query(ref, ...base, orderBy('createdAt', 'asc'), startAfter(createdAt), limit(1)))
    ]);

    return {
      prev: prevSnap.empty ? null : { id: prevSnap.docs[0].id, ...prevSnap.docs[0].data() } as Blog,
      next: nextSnap.empty ? null : { id: nextSnap.docs[0].id, ...nextSnap.docs[0].data() } as Blog
    };
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  calculateReadTime(content: string): number {
    const text = content.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  getCoverUrl(blog: Partial<Blog>): string {
    return blog.coverImageUrl || blog.coverImageBase64 || '';
  }
}