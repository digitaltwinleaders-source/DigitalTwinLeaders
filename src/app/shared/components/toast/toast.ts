import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [AsyncPipe],
  template: `
  @for (toast of toastService.toasts$ | async; track toast.id) {
    <div class="toast align-items-center text-monochrome-100 border-0 show bg-{{toast.state}}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                {{ toast.content }}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toastService.remove(toast)"></button>
        </div>
    </div>
  }
  `,
  host: { class: 'toast-container position-fixed bottom-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsContainer {
  toastService = inject(ToastService);
}