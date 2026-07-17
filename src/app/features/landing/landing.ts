import { Component, inject, OnInit } from '@angular/core';
import { Hero } from './hero/hero';
import { About } from "./about/about";
import { Programs } from './programs/programs';
import { Values } from './values/values';
import { Join } from "./join/join";
import { Community } from './community/community';
import { Advantages } from './advantages/advantages';
import { Institute } from './institute/institute';
import { CouncilComponent } from './council/council';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  imports: [Hero, About, Programs, Values, Community, Institute, Advantages, CouncilComponent, Join]
})
export class Landing implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: '',
      description: 'Digital Twin Leaders is the global digital twin community offering vendor-neutral courses, certificates, and credentials. Explore digital twin standards, smart city initiatives, BIM, GIS, and IoT frameworks aligned with ISO 30173.',
      url: '/',
      keywords: 'digital twin, digital twins, digital twin course, digital twin certificate, digital twin credentials, digital twin community, digital twin council, smart cities, smart city, BIM, GIS, IoT, digital twin standards, digital twin ISO, digital twin training, digital twin professionals',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Digital Twin Leaders',
        url: 'https://www.digitaltwinleaders.com',
        logo: 'https://www.digitaltwinleaders.com/assets/logo.png',
        description: 'A global digital twin community and knowledge ecosystem offering courses, certificates, and credentials for professionals working with digital twins, smart cities, BIM, GIS, and IoT.',
        sameAs: [],
      },
    });
  }
}
