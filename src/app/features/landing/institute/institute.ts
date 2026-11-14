import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-institute',
  imports: [NgStyle, RouterLink],
  templateUrl: './institute.html'
})
export class Institute {
  list = ["Guided chapters with practical frameworks", "Ready-to-use templates and worksheets", "DTPP Practitioner Status on completion", "Included with Council Membership"];
}
