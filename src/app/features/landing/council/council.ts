import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CouncilService } from '../../../core/services/council.service';
import { ImageService } from '../../../core/services/image.service';
import { COUNCIL_REGIONS, CouncilMember, CouncilRegion } from '../../../core/models/council-member.model';
import { nameInitial } from '../../../core/utils/utils';
import { CouncilCardComponent } from './card/card';

const PAGE_SIZE = 12;

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
  regions = COUNCIL_REGIONS;
  searchTerm = signal('');
  selectedRegion = signal('');
  practitionerFilter = signal<'all' | 'yes' | 'no'>('all');
  openFilterDropdown = signal<'region' | 'practitioner' | null>(null);
  visibleCount = signal(PAGE_SIZE);
  filteredMembers = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const region = this.selectedRegion();
    const practitioner = this.practitionerFilter();

    return this.members().filter(member =>
      (!searchTerm || [member.name, member.organization, member.role]
        .some(value => value?.toLowerCase().includes(searchTerm)))
      && (!region || member.region === region)
      && (practitioner === 'all'
        || Boolean(member.practitioner) === (practitioner === 'yes'))
    );
  });
  displayedMembers = computed(() => {
    const members = this.members();
    if (this.featuredOnly()) {
      const featuredMembers = members.filter(member => member.featured);
      return featuredMembers.length ? featuredMembers : members.slice(0, 8);
    }

    return this.filteredMembers().slice(0, this.visibleCount());
  });
  hasMore = computed(() => !this.featuredOnly()
    && this.filteredMembers().length > this.displayedMembers().length);
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

  onSearchInput(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;

    this.searchTerm.set(input.value);
    this.visibleCount.set(PAGE_SIZE);
  }

  toggleFilterDropdown(filter: 'region' | 'practitioner'): void {
    this.openFilterDropdown.update(open => open === filter ? null : filter);
  }

  closeFilterDropdown(): void {
    this.openFilterDropdown.set(null);
  }

  selectRegion(region: CouncilRegion | ''): void {
    this.selectedRegion.set(region);
    this.visibleCount.set(PAGE_SIZE);
    this.closeFilterDropdown();
  }

  selectPractitionerFilter(filter: 'all' | 'yes' | 'no'): void {
    this.practitionerFilter.set(filter);
    this.visibleCount.set(PAGE_SIZE);
    this.closeFilterDropdown();
  }

  practitionerFilterLabel(): string {
    if (this.practitionerFilter() === 'yes') return 'Yes';
    if (this.practitionerFilter() === 'no') return 'No';
    return 'All';
  }

  loadMore(): void {
    this.visibleCount.update(count => count + PAGE_SIZE);
  }
}