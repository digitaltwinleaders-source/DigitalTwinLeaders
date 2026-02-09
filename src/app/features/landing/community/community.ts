import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-community',
  imports: [RouterLink],
  templateUrl: './community.html'
})
export class Community {
  cardList = [
    {
      title: 'Smart Cities',
      icon: 'buildings'
    },
    {
      title: 'Energy',
      icon: 'lightning-charge'
    },
    {
      title: 'Transportation',
      icon: 'bus-front'
    },
    {
      title: 'Manufacturing',
      icon: 'house-gear'
    },
    {
      title: 'Academia',
      icon: 'mortarboard'
    },
    {
      title: 'Enterprise',
      icon: 'suitcase-lg'
    }
  ];
}
