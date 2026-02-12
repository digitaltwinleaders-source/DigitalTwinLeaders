import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-media-links',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="d-flex gap-2">
        @for (item of socialMedia; track $index) {
            <a href="{{ item.link }}" target="_blank" class="text-decoration-none">
              <div class="bg-{{color}} bg-opacity-10 rounded-2 d-flex justify-content-center align-items-center mb-3 mx-auto" [ngStyle]="{width: '36px', height: '36px'}">
                <i class="bi bi-{{ item.icon }} text-{{color}}"></i>
              </div>
            </a>
        }
    </div>
  `,
})
export class SocialMediaLinks {
  @Input() color = 'monochrome-100';

  socialMedia = [
    { icon: 'linkedin', link: 'https://www.linkedin.com/company/digitaltwinleaders' },
    { icon: 'twitter-x', link: 'https://x.com/DigitalTwinLead' },
    { icon: 'youtube', link: 'https://youtube.com/@digitaltwinleaders?si=uPmRG4L_hQ2iEQS2' },
    { icon: 'instagram', link: 'https://www.instagram.com/digitaltwinleaders' }
  ];
}