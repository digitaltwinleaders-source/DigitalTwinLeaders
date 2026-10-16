import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';

@Component({
  selector: 'app-membership',
  imports: [NgStyle, Subscribe],
  templateUrl: './membership.html'
})
export class Membership {
  benefits = [
    'The Digital Twin Project Planner track and its six planning tools',
    'Your profile on the DTL website from day one',
    'A LinkedIn welcome post when you join, and a congratulations post when you earn Practitioner Status',
    'Publish your articles on the DTL website',
    'Priority to speak at DTL events',
  ];
}
