import { Component, inject, signal } from '@angular/core';
import { Mailchimp } from '../../../core/services/mailchimp';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { SocialMediaLinks } from '../social-media/social-media';

interface AlertData {
  type: 'success' | 'danger';
  icon: 'check2' | 'x-lg';
  title: string;
  body: string;
}
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.html',
  imports: [FormsModule, NgStyle, SocialMediaLinks],
})
export class Subscribe {
  email: string = '';
  isLoading = signal<boolean>(false);
  alertData = signal<AlertData | null>(null);
  
  private mailchimp = inject(Mailchimp);

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
            title: "You're on the list!",
            body: "Follow us on social media — we'll let you know when our first course launches.",
          });
        },
        error: () => {
          this.alertData.set({
            type: 'danger',
            icon: 'x-lg',
            title: 'Something went wrong!',
            body: 'Please try again later.',
          });
        },
      });
  }
}
