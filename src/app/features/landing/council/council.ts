import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouncilService } from '../../../core/services/council.service';
import { ImageService } from '../../../core/services/image.service';
import { CouncilMember } from '../../../core/models/council-member.model';
import { nameInitial } from '../../../core/utils/utils';


@Component({
  selector: 'app-council',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './council.html',
  styleUrls: ['./council.scss']
})
export class CouncilComponent implements OnInit {
  councilService = inject(CouncilService);
  imageService = inject(ImageService);

  members = signal<CouncilMember[]>([]);
  loading = signal(true);
  hoveredId = signal<string | null>(null);
  skeletons = [1, 2, 3, 4, 5, 6];

  ngOnInit() {
    this.councilService.getMembers().subscribe({
      next: (data) => { this.members.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  nameInitial(member: CouncilMember): string {
    return nameInitial(member.name);
  }
}