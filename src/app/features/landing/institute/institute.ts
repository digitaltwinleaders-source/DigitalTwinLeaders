import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-institute',
  imports: [NgStyle],
  templateUrl: './institute.html'
})
export class Institute {
  list = ["Project-Based Learning", "Practical Tools & Templates", "Certificate of Completion", "DTL Community Access"];

  exploreInstitute() {
    window.open('https://lms.digitaltwinleaders.com/', '_blank');
  }
}
