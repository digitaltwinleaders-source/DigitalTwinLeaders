import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly MAX_SIZE_KB = 200;
  private readonly MAX_WIDTH = 400;
  private readonly MAX_HEIGHT = 400;

  compressAndConvertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Resize if needed
          if (width > this.MAX_WIDTH || height > this.MAX_HEIGHT) {
            const ratio = Math.min(
              this.MAX_WIDTH / width,
              this.MAX_HEIGHT / height
            );
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          // Compress iteratively until under MAX_SIZE_KB
          let quality = 0.9;
          let base64 = canvas.toDataURL('image/jpeg', quality);

          while (
            this.getBase64SizeKB(base64) > this.MAX_SIZE_KB &&
            quality > 0.1
          ) {
            quality -= 0.1;
            base64 = canvas.toDataURL('image/jpeg', quality);
          }

          if (this.getBase64SizeKB(base64) > this.MAX_SIZE_KB) {
            reject(new Error('Image is too large even after compression. Please use a smaller image.'));
            return;
          }

          resolve(base64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  private getBase64SizeKB(base64: string): number {
    const base64Data = base64.split(',')[1] || base64;
    return (base64Data.length * 3) / 4 / 1024;
  }

  // ── Migration helper ──────────────────────────────────────────────────────
  // When migrating to Firebase Storage, call this to get the display URL.
  // Components always call this — they never read photoBase64 directly.
  getDisplayUrl(member: { photoBase64?: string; imageUrl?: string }): string {
    return member.imageUrl || member.photoBase64 || '';
  }
}