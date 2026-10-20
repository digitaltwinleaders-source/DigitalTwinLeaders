import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SocialMediaLinks } from '../../shared/components/social-media/social-media';

@Component({
  selector: 'app-footer',
  imports: [SocialMediaLinks, RouterLink],
  templateUrl: './footer.html'
})
export class Footer {}
