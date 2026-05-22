import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CouncilService } from '../../../core/services/council.service';
import { ImageService } from '../../../core/services/image.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.';
import { CouncilMember } from '../../../core/models/council-member.model';
import { nameInitial } from '../../../core/utils/utils';

type FormMode = 'add' | 'edit';

@Component({
  selector: 'app-admin-council',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, ImageUploadComponent],
  templateUrl: './council.html',
  styleUrls: ['./council.scss']
})
export class AdminCouncilComponent implements OnInit {
  private councilService = inject(CouncilService);
  imageService = inject(ImageService);

  members = signal<CouncilMember[]>([]);
  loading = signal(true);
  drawerOpen = signal(false);
  saving = signal(false);
  formError = signal('');
  mode = signal<FormMode>('add');
  editingId = signal<string | null>(null);
  deleteTarget = signal<CouncilMember | null>(null);

  form: Partial<CouncilMember> = this.emptyForm();

  isFormValid() {
    return !!this.form.name?.trim() && !!this.form.role?.trim() && !!this.form.order;
  }

  ngOnInit() {
    this.councilService.getMembers().subscribe({
      next: (data) => { this.members.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  nameInitial(member: CouncilMember): string {
    return nameInitial(member.name);
  }

  openAdd() {
    this.mode.set('add');
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formError.set('');
    this.drawerOpen.set(true);
  }

  openEdit(member: CouncilMember) {
    this.mode.set('edit');
    this.editingId.set(member.id!);
    this.form = { ...member };
    this.formError.set('');
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    if (this.saving()) return;
    this.drawerOpen.set(false);
  }

  confirmDelete(member: CouncilMember) {
    this.deleteTarget.set(member);
  }

  async save() {
    if (!this.isFormValid()) return;
    this.saving.set(true);
    this.formError.set('');
    try {
      const payload: Omit<CouncilMember, 'id'> = {
        name: this.form.name!.trim(),
        role: this.form.role!.trim(),
        bio: this.form.bio?.trim() || '',
        organization: this.form.organization?.trim() || '',
        linkedInUrl: this.form.linkedInUrl?.trim() || '',
        order: Number(this.form.order),
        photoBase64: this.form.photoBase64 || '',
        imageUrl: this.form.imageUrl || '',
      };
      if (this.mode() === 'add') {
        await this.councilService.addMember(payload);
      } else {
        await this.councilService.updateMember(this.editingId()!, payload);
      }
      this.drawerOpen.set(false);
    } catch {
      this.formError.set('Something went wrong. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteMember() {
    if (!this.deleteTarget()) return;
    this.saving.set(true);
    try {
      await this.councilService.deleteMember(this.deleteTarget()!.id!);
      this.deleteTarget.set(null);
    } catch {
      // silent — member list will stay unchanged
    } finally {
      this.saving.set(false);
    }
  }

  async onDrop(event: CdkDragDrop<CouncilMember[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    
    const currentMembers = [...this.members()];
    const movedMember = currentMembers[event.previousIndex];
    
    currentMembers.splice(event.previousIndex, 1);
    currentMembers.splice(event.currentIndex, 0, movedMember);
    this.members.set(currentMembers);
    
    try {
      await this.councilService.updateOrder(currentMembers);
    } catch {
      // Revert to previous state if update fails
      this.councilService.getMembers().subscribe({
        next: (data) => this.members.set(data),
        error: () => {}
      });
    }
  }

  private emptyForm(): Partial<CouncilMember> {
    return {
      name: '',
      role: '',
      bio: '',
      organization: '',
      linkedInUrl: '',
      order: (this.members().length || 0) + 1,
      photoBase64: '',
      imageUrl: ''
    };
  }
}