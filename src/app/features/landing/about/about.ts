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
      title: 'Frameworks you can use on your next project',
      description: 'Vendor-neutral tracks, starting with the Digital Twin Project Planner. You build real deliverables, not notes you forget.',
      icon: 'diagram-3'
    },
    {
      title: 'Visibility for your work',
      description: 'Your profile on the DTL website, a LinkedIn welcome when you join, and space to publish articles on the DTL site.',
      icon: 'megaphone'
    },
    {
      title: 'Peers who do the same work',
      description: 'Practitioners across cities, infrastructure, AEC, utilities and manufacturing, sharing what works.',
      icon: 'people'
    }
  ];
}
