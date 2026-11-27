import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
  imports: [RouterLink],
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
