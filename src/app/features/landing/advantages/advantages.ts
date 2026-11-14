import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-advantages',
  imports: [NgStyle],
  templateUrl: './advantages.html'
})
export class Advantages {
    cardList = [
    {
      title: 'Vendor-Neutral',
      body: 'Independent from any single technology provider',
      icon: 'shield'
    },
    {
      title: 'Global Standards',
      body: 'Methods inspired by ISO/IEC 30173 and industry frameworks',
      icon: 'globe'
    },
    {
      title: 'Practitioner-Led',
      body: 'Built by practicing industry professionals',
      icon: 'mortarboard'
    },
    {
      title: 'Editorial Support',
      body: 'We help members shape and publish their work',
      icon: 'award'
    }
  ];
}
