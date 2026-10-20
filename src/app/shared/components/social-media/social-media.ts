import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-media-links',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="d-flex gap-2">
        @for (item of socialMedia; track $index) {
            <a href="{{ item.link }}" target="_blank" rel="noopener" class="text-decoration-none" [attr.aria-label]="item.label">
              <div class="bg-{{color}} bg-opacity-10 rounded-2 d-flex justify-content-center align-items-center mb-3 mx-auto" [ngStyle]="{width: '36px', height: '36px'}">
                <i class="bi bi-{{ item.icon }} text-{{color}}" aria-hidden="true"></i>
              </div>
            </a>
        }
    </div>
  `,
})
export class SocialMediaLinks {
  @Input() color = 'monochrome-100';

  socialMedia = [
    { icon: 'linkedin', label: 'Digital Twin Leaders on LinkedIn', link: 'https://www.linkedin.com/company/digitaltwinleaders' },
    { icon: 'twitter-x', label: 'Digital Twin Leaders on X', link: 'https://x.com/DigitalTwinLead' },
    { icon: 'youtube', label: 'Digital Twin Leaders on YouTube', link: 'https://youtube.com/@digitaltwinleaders?si=uPmRG4L_hQ2iEQS2' },
    { icon: 'instagram', label: 'Digital Twin Leaders on Instagram', link: 'https://www.instagram.com/digitaltwinleaders' }
  ];
}