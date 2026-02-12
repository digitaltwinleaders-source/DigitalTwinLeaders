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
      body: 'Aligned with ISO, IEC, and industry frameworks',
      icon: 'globe'
    },
    {
      title: 'Expert-Led',
      body: 'Courses designed by practicing industry leaders',
      icon: 'mortarboard'
    },
    {
      title: 'Peer-Reviewed',
      body: 'Content validated by cross-sector advisory board',
      icon: 'award'
    }
  ];
}
