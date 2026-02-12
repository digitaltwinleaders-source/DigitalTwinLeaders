import { Component } from '@angular/core';
import { SocialMediaLinks } from '../../shared/components/social-media/social-media';

@Component({
  selector: 'app-footer',
  imports: [SocialMediaLinks],
  templateUrl: './footer.html'
})
export class Footer {}
