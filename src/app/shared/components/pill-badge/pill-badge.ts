import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pill-badge',
  templateUrl: './pill-badge.html',
  imports: [NgClass]
})
export class PillBadge {
  @Input() text: string = 'Placeholder';
  @Input() color: string = 'white';
  @Input() dot: 'info' | 'danger' | 'success' | 'warning' = 'info';
  @Input() background: boolean = true;
}