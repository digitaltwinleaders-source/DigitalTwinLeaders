import { Component, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../../core/services/image.service';
import { CouncilMember } from '../../../../core/models/council-member.model';
import { nameInitial } from '../../../../core/utils/utils';


@Component({
  selector: 'app-council-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class CouncilCardComponent {
  imageService = inject(ImageService);

  member = input.required<CouncilMember>();
  hoveredId = signal<string | null>(null);

  nameInitial(member: CouncilMember): string {
    return nameInitial(member.name);
  }
}