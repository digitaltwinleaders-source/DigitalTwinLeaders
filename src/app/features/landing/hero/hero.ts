import { Component } from '@angular/core';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [PillBadge, Subscribe, NgStyle],
  templateUrl: './hero.html'
})
export class Hero {}
