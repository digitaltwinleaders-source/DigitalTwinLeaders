import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
})
export class Privacy implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: 'Privacy Policy',
      description: 'How Digital Twin Leaders collects and uses personal information.',
      url: '/privacy',
    });
  }
}
