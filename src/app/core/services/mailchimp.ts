import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Mailchimp {
  private http = inject(HttpClient);

  subscribe(email: string) {
    const url = 'https://digitaltwinleaders.us14.list-manage.com/subscribe/post-json?u=b7a60a8081f25614caba91914&id=525b19a160&f_id=00269ae1f0';
    const mailchimpUrl = `${url}&EMAIL=${encodeURIComponent(email)}`;
    return this.http.jsonp(mailchimpUrl, 'c');
  }
}
