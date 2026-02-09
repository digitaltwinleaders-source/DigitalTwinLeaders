import { Component } from '@angular/core';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';

@Component({
  selector: 'app-join',
  imports: [PillBadge, Subscribe],
  templateUrl: './join.html'
})
export class Join {}
