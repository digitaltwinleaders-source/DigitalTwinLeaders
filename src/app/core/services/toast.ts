import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  content: string | TemplateRef<any>;
  state?: string;
  id?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(toast: Toast) {
    const newToast = { ...toast, id: Date.now(), state: toast.state || 'success' };
    this.toastsSubject.next([...this.toastsSubject.value, newToast]);
    setTimeout(() => {
      this.remove(newToast);
    }, 5000);
  }

  remove(toast: Toast) {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== toast.id));
  }
}