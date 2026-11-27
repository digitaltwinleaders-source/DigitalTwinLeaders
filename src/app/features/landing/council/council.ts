import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CouncilService } from '../../../core/services/council.service';
import { ImageService } from '../../../core/services/image.service';
import { CouncilMember } from '../../../core/models/council-member.model';
import { nameInitial } from '../../../core/utils/utils';
import { CouncilCardComponent } from './card/card';


@Component({
  selector: 'app-council',
  standalone: true,
  imports: [CommonModule, RouterLink, CouncilCardComponent],
  templateUrl: './council.html',
  styleUrls: ['./council.scss']
})
export class CouncilComponent implements OnInit {
  councilService = inject(CouncilService);
  imageService = inject(ImageService);

  featuredOnly = input(false);
  members = signal<CouncilMember[]>([]);
  displayedMembers = computed(() => {
    const members = this.members();
    if (!this.featuredOnly()) return members;

    const featuredMembers = members.filter(member => member.featured);
    return featuredMembers.length ? featuredMembers : members.slice(0, 8);
  });
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