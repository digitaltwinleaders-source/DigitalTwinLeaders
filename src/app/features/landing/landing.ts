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
      description: 'Digital Twin Leaders is a global professional community where digital twin professionals make their mark: stay current, exchange ideas with practitioners worldwide, and build a reputation through what you contribute.',
      url: '/',
      keywords: 'digital twin, digital twins, digital twin community, digital twin professionals, digital twin council, digital twin project planning, digital twin articles, digital twin events, smart cities, smart city, BIM, GIS, IoT, digital twin standards, ISO/IEC 30173',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Digital Twin Leaders',
        url: 'https://www.digitaltwinleaders.com',
        logo: 'https://www.digitaltwinleaders.com/assets/logo.png',
        description: 'A global professional community where digital twin professionals make their mark by sharing what they have learned, connecting with peers, and growing their standing in the field.',
        sameAs: [],
      },
    });
  }
}
