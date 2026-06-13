import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-institute',
  imports: [NgStyle, RouterLink],
  templateUrl: './institute.html'
})
export class Institute {
  list = ["Project-Based Learning", "Practical Tools & Templates", "Certificate of Completion", "DTL Community Access"];
}
