import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-values',
  imports: [NgStyle],
  templateUrl: './values.html'
})
export class Values {
cardList = [
    {
      title: 'Credibility',
      description: 'Rooted in vendor neutrality and methods inspired by international standards.',
      icon: 'shield-check'
    },
    {
      title: 'Contribution',
      description: 'Built on members sharing real project experience, with editorial support from DTL.',
      icon: 'award'
    },
    {
      title: 'Community',
      description: 'Cultivated by fostering open knowledge exchange and meaningful peer-to-peer collaboration.',
      icon: 'people'
    },
    {
      title: 'Innovation',
      description: 'Driven by new ideas from practitioners and the continuous evolution of digital twin methods.',
      icon: 'lightbulb'
    }
  ];
}
