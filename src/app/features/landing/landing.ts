import { Component, inject, OnInit } from '@angular/core';
import { Hero } from './hero/hero';
import { About } from "./about/about";
import { Values } from './values/values';
import { Join } from "./join/join";
import { Community } from './community/community';
import { Institute } from './institute/institute';
import { CouncilComponent } from './council/council';
import { Membership } from './membership/membership';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  imports: [Hero, About, Values, Institute, CouncilComponent, Membership, Community, Join]
})
export class Landing implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: '',
      fullTitle: 'Digital Twin Leaders (DTL): Vendor-Neutral Digital Twin Community',
      description: 'Digital Twin Leaders (DTL) is a vendor-neutral professional platform for digital twin practitioners: practical frameworks, an international council and member articles.',
      url: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Digital Twin Leaders',
        alternateName: 'DTL',
        url: 'https://www.digitaltwinleaders.com',
        logo: 'https://www.digitaltwinleaders.com/assets/logo.png',
        description: 'Digital Twin Leaders (DTL) is a vendor-neutral professional platform for digital twin practitioners: practical frameworks, an international council and member articles.',
        sameAs: [
          'https://www.linkedin.com/company/digitaltwinleaders',
          'https://x.com/DigitalTwinLead',
          'https://www.youtube.com/@digitaltwinleaders',
          'https://www.instagram.com/digitaltwinleaders',
        ],
      },
    });
  }
}
