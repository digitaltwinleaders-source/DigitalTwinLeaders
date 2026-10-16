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
      title: 'Vendor-neutral',
      description: 'No platform to sell, no product agenda.',
      icon: 'shield-check'
    },
    {
      title: 'Inspired by ISO/IEC 30173',
      description: 'Grounded in the international digital twin standard.',
      icon: 'globe'
    },
    {
      title: 'Built by practitioners',
      description: 'Frameworks written by people who deliver digital twins.',
      icon: 'tools'
    }
  ];
}
