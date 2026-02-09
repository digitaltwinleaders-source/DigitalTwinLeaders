import { Component, inject } from '@angular/core';
import { Mailchimp } from '../../../core/services/mailchimp';
import { finalize } from 'rxjs'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.html',
  imports: [FormsModule]
})
export class Subscribe {
  email: string = '';
  isLoading = false;
  private mailchimp = inject(Mailchimp);

  subscribe() {
    this.isLoading = true;
    this.mailchimp.subscribe(this.email).pipe(finalize(() => this.isLoading = false)).subscribe();
  }
}