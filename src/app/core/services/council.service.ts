import { Injectable, inject } from '@angular/core';
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
import { Observable } from 'rxjs';
import { CouncilMember } from '../models/council-member.model';

@Injectable({ providedIn: 'root' })
export class CouncilService {
  private firestore = inject(Firestore);
  private readonly COLLECTION = 'council';

  getMembers(): Observable<CouncilMember[]> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(ref, orderBy('order', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<CouncilMember[]>;
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
}