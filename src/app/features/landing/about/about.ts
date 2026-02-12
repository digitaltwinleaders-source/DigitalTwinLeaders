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
      description: 'To simplify, standardize, and amplify digital twin knowledge for professionals worldwide. We bridge the gap between education, collaboration, and real-world application—aligning global practices with emerging standards.',
      icon: 'bullseye'
    },
    {
      title: 'Our Direction',
      description: 'To become the indispensable global reference point for digital twin competence. We evolve a shared knowledge framework that translates into intelligent, data-driven, and sustainable decision-making.',
      icon: 'compass'
    },
    {
      title: 'Our Vision',
      description: 'Shaping the future of industries and cities through responsible and impactful use of digital twins. We empower professionals to lead transformation across sectors worldwide.',
      icon: 'eye'
    }
  ];
}
