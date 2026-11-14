import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [NgStyle],
  templateUrl: './about.html'
})
export class About {
  cardList = [
    {
      title: 'Our Purpose',
      description: 'To help practitioners turn what they learn on real projects into knowledge others in the field can use.',
      icon: 'bullseye'
    },
    {
      title: 'Our Direction',
      description: 'To make contributing easy, with editorial support and opportunities to publish articles, give written interviews, and speak at events.',
      icon: 'compass'
    },
    {
      title: 'Our Vision',
      description: 'A field where lessons from digital twin projects no longer stay locked inside one company, and practitioners grow by sharing them.',
      icon: 'eye'
    }
  ];
}
