import { Component, inject, signal, input } from '@angular/core';
import { Mailchimp } from '../../../core/services/mailchimp';
import { finalize } from 'rxjs';
import { FormsModule, NgModel } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { SocialMediaLinks } from '../social-media/social-media';

interface AlertData {
  type: 'success' | 'danger';
  icon: 'check2' | 'x-lg';
  title: string;
  body: string;
}

let nextId = 0;

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.html',
  styles: [`
    .subscribe-field { width: 100%; }
    @media (min-width: 768px) { .subscribe-field { width: 320px; } }
  `],
  imports: [FormsModule, NgStyle, SocialMediaLinks],
})
export class Subscribe {
  email: string = '';
  isLoading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  alertData = signal<AlertData | null>(null);

  subscribeButtonText = input<string>('Get free updates');
  note = input<string>('Free digital twin content, member discounts, and first news of new tracks and events. No spam. Unsubscribe anytime.');
  /** Lighter helper text for use on dark backgrounds. */
  dark = input<boolean>(false);

  readonly inputId = `subscribe-email-${nextId++}`;
  private mailchimp = inject(Mailchimp);

  submit(model: NgModel) {
    this.submitted.set(true);
    if (model.invalid || this.isLoading()) {
      return;
    }
    this.subscribe();
  }

  subscribe() {
    this.isLoading.set(true);

    this.mailchimp
      .subscribe(this.email)
      .pipe(finalize(() => (this.isLoading.set(false))))
      .subscribe({
        next: () => {
          this.alertData.set({
            type: 'success',
            icon: 'check2',
            title: "You're on the list",
            body: "Thanks for joining Digital Twin Leaders. Check your inbox for a welcome email, and follow us for new frameworks, articles and member news.",
          });
        },
        error: () => {
          this.alertData.set({
            type: 'danger',
            icon: 'x-lg',
            title: "We couldn't add you just now",
            body: 'Please check your connection and try again.',
          });
        },
      });
  }
}
