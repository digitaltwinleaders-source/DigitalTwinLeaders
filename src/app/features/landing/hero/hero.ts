import { Component } from '@angular/core';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [PillBadge, Subscribe, NgStyle, RouterLink],
  templateUrl: './hero.html'
})
export class Hero {}
