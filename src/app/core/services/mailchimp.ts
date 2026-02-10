import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastService } from './toast';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Mailchimp {
  message: string = '';

  private http = inject(HttpClient);
  private toast = inject(ToastService);

  subscribe(email: string) {
    const url = 'https://digitaltwinleaders.us14.list-manage.com/subscribe/post-json?u=b7a60a8081f25614caba91914&id=525b19a160&f_id=00269ae1f0';
    const mailchimpUrl = `${url}&EMAIL=${encodeURIComponent(email)}`;

    return this.http.jsonp(mailchimpUrl, 'c').pipe(
      tap((response: any) => {
        if (response.msg.includes('already subscribed')) {
          this.toast.show({content: 'You are already on our list!', state: 'warning'});
        } 
        else if (response.result === 'success') {
          this.toast.show({ content: 'You have successfully subscribed.', state: 'success' });
        } 
        else {
          const cleanMsg = response.msg.replace(/<[^>]*>?/gm, '');
          this.toast.show({ content: cleanMsg, state: 'danger' });
        }
      }),
      catchError(() => {
        this.toast.show({ content: 'Network error. Please try again.', state: 'danger' });
        throw new Error('Network error');
      })
    );
  }
}
