import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { CouncilMember } from '../models/council-member.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CouncilService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly COLLECTION = 'council';

  getMembers(): Observable<CouncilMember[]> {
    if (isPlatformBrowser(this.platformId)) {
      const ref = collection(this.firestore, this.COLLECTION);
      const q = query(ref, orderBy('order', 'asc'));
      return collectionData(q, { idField: 'id' }) as Observable<CouncilMember[]>;
    }

    // SSR: use Firestore REST API so data is available during prerendering
    const projectId = environment.firebase.projectId;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${this.COLLECTION}?orderBy=order`;
    return this.http.get<any>(url).pipe(
      map(res => {
        if (!res.documents) return [];
        return res.documents.map((doc: any) => this.mapFirestoreDoc(doc));
      })
    );
  }

  async addMember(member: Omit<CouncilMember, 'id'>): Promise<void> {
    const ref = collection(this.firestore, this.COLLECTION);
    await addDoc(ref, {
      ...member,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }

  async updateMember(id: string, data: Partial<CouncilMember>): Promise<void> {
    const ref = doc(this.firestore, `${this.COLLECTION}/${id}`);
    await updateDoc(ref, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async deleteMember(id: string): Promise<void> {
    const ref = doc(this.firestore, `${this.COLLECTION}/${id}`);
    await deleteDoc(ref);
  }

  async updateOrder(members: CouncilMember[]): Promise<void> {
    const updates = members.map((m, index) =>
      this.updateMember(m.id!, { order: index + 1 })
    );
    await Promise.all(updates);
  }

  private mapFirestoreDoc(doc: any): CouncilMember {
    const fields = doc.fields || {};
    const id = doc.name?.split('/').pop() || '';
    return {
      id,
      name: fields.name?.stringValue ?? '',
      role: fields.role?.stringValue ?? '',
      country: fields.country?.stringValue,
      countryName: fields.countryName?.stringValue,
      bio: fields.bio?.stringValue,
      organization: fields.organization?.stringValue,
      linkedInUrl: fields.linkedInUrl?.stringValue,
      order: Number(fields.order?.integerValue ?? 0),
      photoBase64: fields.photoBase64?.stringValue,
      imageUrl: fields.imageUrl?.stringValue,
    };
  }
}