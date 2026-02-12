import { Component } from '@angular/core';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-join',
  imports: [PillBadge, RouterLink],
  templateUrl: './join.html'
})
export class Join {}
