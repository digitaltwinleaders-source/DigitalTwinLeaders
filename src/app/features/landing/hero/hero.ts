import { Component } from '@angular/core';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';

@Component({
  selector: 'app-hero',
  imports: [PillBadge, Subscribe],
  templateUrl: './hero.html'
})
export class Hero {}
