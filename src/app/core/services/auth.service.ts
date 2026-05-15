import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Admin } from '../models/admin.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private _adminData = signal<Admin | null>(null);
  private _authLoading = signal<boolean>(true);

  readonly adminData = this._adminData.asReadonly();
  readonly authLoading = this._authLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._adminData() !== null);
  readonly isAdmin = computed(() => this._adminData()?.role === 'admin');

  constructor() {
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (firebaseUser) => {
        if (firebaseUser) {
          await this.loadAdminData(firebaseUser.uid);
        } else {
          this._adminData.set(null);
        }
        this._authLoading.set(false);
      });
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    await this.loadAdminData(credential.user.uid);

    if (!this._adminData()) {
      await this.logout(false);
      throw new Error('Access denied. This account does not have admin privileges.');
    }

    await this.router.navigate(['/admin/council']);
  }

  async logout(navigate = true): Promise<void> {
    await signOut(this.auth);
    this._adminData.set(null);
    if (navigate) await this.router.navigate(['/admin/login']);
  }

  private async loadAdminData(uid: string): Promise<void> {
    try {
      const adminRef = doc(this.firestore, `admins/${uid}`);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        this._adminData.set({ uid, ...adminSnap.data() } as Admin);
      } else {
        this._adminData.set(null);
      }
    } catch {
      this._adminData.set(null);
    }
  }
}