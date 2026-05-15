import {
  Component, inject, input, output,
  signal, computed, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrls: ['./image-upload.scss']  
})
export class ImageUploadComponent {
  private imageService = inject(ImageService);

  label = input<string>('Upload photo');
  initialImage = input<string>('');

  imageSelected = output<string>();
  imageRemoved = output<void>();

  isDragging = signal(false);
  error = signal('');
  private _preview = signal('');

  previewUrl = computed(() => this._preview() || this.initialImage());

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  private async processFile(file: File) {
    this.error.set('');
    try {
      const base64 = await this.imageService.compressAndConvertToBase64(file);
      this._preview.set(base64);
      this.imageSelected.emit(base64);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to process image');
    }
  }

  removeImage() {
    this._preview.set('');
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.imageRemoved.emit();
  }
}