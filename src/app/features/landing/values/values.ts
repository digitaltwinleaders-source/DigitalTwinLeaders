import { Component } from '@angular/core';

@Component({
  selector: 'app-values',
  imports: [],
  templateUrl: './values.html'
})
export class Values {
cardList = [
    {
      title: 'Credibility',
      description: 'Rooted in our neutrality, rigorous research, and alignment with international standards.',
      icon: 'shield-check'
    },
    {
      title: 'Authority',
      description: 'Forged through cutting-edge thought leadership and the curated contributions of global experts.',
      icon: 'award'
    },
    {
      title: 'Community',
      description: 'Cultivated by fostering open knowledge exchange and meaningful peer-to-peer collaboration.',
      icon: 'people'
    },
    {
      title: 'Innovation',
      description: 'Driven by the continuous evolution of methods, tools, and insights that empower professionals.',
      icon: 'lightbulb'
    }
  ];
}
