import { Component } from '@angular/core';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [Subscribe, NgStyle],
  templateUrl: './hero.html'
})
export class Hero {}
