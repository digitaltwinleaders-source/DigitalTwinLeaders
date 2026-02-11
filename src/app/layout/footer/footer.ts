import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html'
})
export class Footer {
  socialMedia = [
    { icon: 'linkedin', link: '' },
    { icon: 'twitter-x', link: '' },
    { icon: 'youtube', link: '' },
    { icon: 'envelope', link: '' }
  ];
}
