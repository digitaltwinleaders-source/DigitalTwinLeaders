import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-institute',
  imports: [NgStyle, RouterLink],
  templateUrl: './institute.html'
})
export class Institute {
  list = ["Six guided chapters with step-by-step frameworks", "Ready-to-use templates and planning tools", "DTPP Practitioner Status on completion", "Included in Council Membership"];
}
