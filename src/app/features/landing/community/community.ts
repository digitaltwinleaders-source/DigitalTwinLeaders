import { Component } from '@angular/core';

@Component({
  selector: 'app-community',
  templateUrl: './community.html'
})
export class Community {
  industries = [
    'Smart cities & infrastructure',
    'AEC & built environment',
    'GIS & geospatial',
    'Utilities & energy',
    'Transportation',
    'Manufacturing',
    'Consulting & advisory',
  ];
}
