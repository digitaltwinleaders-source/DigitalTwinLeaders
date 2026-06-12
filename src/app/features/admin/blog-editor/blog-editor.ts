import {
  Component, inject, signal, computed, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../../core/services/blog.service';
import { ImageService } from '../../../core/services/image.service';
import { AuthService } from '../../../core/services/auth.service';
import { Blog } from '../../../core/models/blog.model';
import {
  sanitizedTextValidator,
  kebabCaseValidator,
  richTextMinLengthValidator,
  stripUnsafeContent,
  richTextMaxLengthValidator
} from '../../../core/validators/validators';

const RICH_TEXT_MIN_LENGTH = 100; // chars, after stripping HTML tags
const RICH_TEXT_MAX_LENGTH = 50000; // chars, after stripping HTML tags
const TITLE_MAX_LENGTH = 120;
const SLUG_MAX_LENGTH = 100;
const EXCERPT_MAX_LENGTH = 200;
const AUTHOR_MAX_LENGTH = 80;

@Component({
  selector: 'app-admin-blog-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, QuillModule],
  templateUrl: './blog-editor.html',
  styleUrls: ['./blog-editor.scss']
})
export class AdminBlogEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private imageService = inject(ImageService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  titleMaxLength = TITLE_MAX_LENGTH;
  slugMaxLength = SLUG_MAX_LENGTH;
  excerptMaxLength = EXCERPT_MAX_LENGTH;

  loading = signal(false);
  saving = signal(false);
  saveTarget = signal<'draft' | 'published'>('draft');
  error = signal('');
  coverError = signal('');
  previewMode = signal(false);
  isEdit = signal(false);
  editId = signal<string | null>(null);
  coverPreview = signal<string>('');
  inlineImageError = signal('');
  inlineImageUploading = signal(false);
  categories = signal<string[]>([
    'Standards', 'Smart Cities', 'BIM/GIS', 'Community',
    'Practice', 'Research', 'Technology', 'Policy'
  ]);
  showNewCategoryInput = signal(false);
  newCategoryValue = '';
  newCategoryError = signal('');

  readonly NEW_CATEGORY_SENTINEL = '__add_new__';
  private quillEditorInstance: any;

  // ── Reactive form replaces the old plain `form: Partial<Blog>` object ──
  form: FormGroup = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(TITLE_MAX_LENGTH),
      sanitizedTextValidator()
    ]],
    slug: ['', [
      Validators.required,
      Validators.maxLength(SLUG_MAX_LENGTH),
      sanitizedTextValidator(),
      kebabCaseValidator()
    ]],
    content: ['', [
      richTextMinLengthValidator(RICH_TEXT_MIN_LENGTH),
      richTextMaxLengthValidator(RICH_TEXT_MAX_LENGTH)
    ]],
    excerpt: ['', [
      Validators.maxLength(EXCERPT_MAX_LENGTH),
      sanitizedTextValidator()
    ]],
    category: ['', [Validators.required]],
    author: ['', [
      Validators.maxLength(AUTHOR_MAX_LENGTH),
      sanitizedTextValidator()
    ]],
    readTime: [1, [Validators.min(1)]],
    status: ['draft'],
    coverImageBase64: ['', [Validators.required]],
    coverImageUrl: ['']
  });

  get titleControl() { return this.form.get('title')!; }
  get slugControl() { return this.form.get('slug')!; }
  get contentControl() { return this.form.get('content')!; }
  get excerptControl() { return this.form.get('excerpt')!; }
  get categoryControl() { return this.form.get('category')!; }
  get authorControl() { return this.form.get('author')!; }

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'align', 'link'
  ];

  // formValid signal removed entirely — form.invalid (from FormGroup) replaces it
  // and updates automatically via Angular's reactive forms change stream,
  // which is what fixes the "doesn't update until I touch another field" bug

  safeContent = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.form.value.content || '')
  );

  async ngOnInit() {
    // Merge in any categories already used across existing blogs
    this.blogService.getCategories().subscribe(existingCats => {
      if (existingCats.length) {
        this.categories.update(list =>
          [...new Set([...list, ...existingCats])].sort()
        );
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(id);
      this.loading.set(true);
      const blog = await this.blogService.getBlogById(id);
      if (blog) {
        this.form.patchValue(blog);
        this.coverPreview.set(blog.coverImageBase64 || blog.coverImageUrl || '');
        this.setCoverValidity();
      } else {
        this.router.navigate(['/admin/blog']);
      }
      this.loading.set(false);
    } else {
      this.form.patchValue({
        author: this.authService.adminData()?.displayName
          || this.authService.adminData()?.email
          || ''
      });
      this.setCoverValidity();
    }

    this.categoryControl.valueChanges.subscribe(value => {
      if (value === this.NEW_CATEGORY_SENTINEL) {
        this.showNewCategoryInput.set(true);
        this.newCategoryValue = '';
        this.newCategoryError.set('');
        queueMicrotask(() => this.categoryControl.setValue('', { emitEvent: false }));
      }
    });
  }

  onTitleBlur() {
    this.titleControl.markAsTouched();
    if (this.titleControl.value && !this.slugControl.value) {
      const generated = this.blogService.generateSlug(this.titleControl.value);
      this.slugControl.setValue(generated);
    }
  }

  onContentChanged() {
    const readTime = this.blogService.calculateReadTime(this.contentControl.value || '');
    this.form.patchValue({ readTime }, { emitEvent: false });
    this.contentControl.markAsTouched();
    this.contentControl.updateValueAndValidity();
  }

  onEditorCreated(editor: any) {
    this.quillEditorInstance = editor;
    const toolbar = editor.getModule('toolbar');
    toolbar.addHandler('image', () => this.triggerImageUpload());
  }

  onCategorySelectChange(value: string) {
    if (value === this.NEW_CATEGORY_SENTINEL) {
      this.showNewCategoryInput.set(true);
      this.newCategoryValue = '';
      this.newCategoryError.set('');
      // Reset the select back to empty so it doesn't visually show the sentinel
      this.categoryControl.setValue('', { emitEvent: false });
    } else {
      this.categoryControl.setValue(value);
    }
  }

  confirmNewCategory() {
    const trimmed = this.newCategoryValue.trim();

    if (!trimmed) {
      this.newCategoryError.set('Category name cannot be empty.');
      return;
    }
    if (trimmed.length > 40) {
      this.newCategoryError.set('Category name is too long (max 40 characters).');
      return;
    }

    const unsafe = /<script[\s\S]*?>|<[^>]+on\w+\s*=|javascript:/gi.test(trimmed);
    if (unsafe) {
      this.newCategoryError.set('This text contains content that isn\'t allowed.');
      return;
    }

    const exists = this.categories().some(
      c => c.toLowerCase() === trimmed.toLowerCase()
    );
    const finalValue = exists
      ? this.categories().find(c => c.toLowerCase() === trimmed.toLowerCase())!
      : trimmed;

    if (!exists) {
      this.categories.update(list => [...list, trimmed].sort());
    }

    this.showNewCategoryInput.set(false);
    this.newCategoryError.set('');
    this.newCategoryValue = '';

    // Wait one microtask so the <select> + new <option> exist in the DOM
    // before we try to set the control's value — otherwise the browser
    // can silently fail to select an option that wasn't there yet.
    queueMicrotask(() => {
      this.categoryControl.setValue(finalValue);
    });
  }

  cancelNewCategory() {
    this.showNewCategoryInput.set(false);
    this.newCategoryValue = '';
    this.newCategoryError.set('');
  }

  triggerImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) this.handleInlineImage(file);
      input.remove();
    };
    input.click();
  }

  private async handleInlineImage(file: File) {
    this.inlineImageError.set('');
    this.inlineImageUploading.set(true);
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const base64 = await this.imageService.compressAndConvertToBase64Cover(file);
      const range = this.quillEditorInstance.getSelection(true) || { index: this.quillEditorInstance.getLength() };
      this.quillEditorInstance.insertEmbed(range.index, 'image', base64, 'user');
      this.quillEditorInstance.setSelection(range.index + 1);
    } catch (err: any) {
      this.inlineImageError.set(err.message || 'Failed to upload image. Please try a smaller file.');
    } finally {
      this.inlineImageUploading.set(false);
    }
  }

  async onCoverSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverError.set('');
    try {
      const base64 = await this.imageService.compressAndConvertToBase64Cover(file);
      this.coverPreview.set(base64);
      this.form.patchValue({ coverImageBase64: base64, coverImageUrl: '' });
      this.setCoverValidity();
    } catch (err: any) {
      this.coverError.set(err.message);
    }
  }

  removeCover() {
    this.coverPreview.set('');
    this.form.patchValue({ coverImageBase64: '', coverImageUrl: '' });
    this.setCoverValidity();
  }

  // Cover image is a custom upload widget with no native HTML input validation,
  // so its "required" state is enforced manually on the hidden form control
  private setCoverValidity() {
    const hasCover = !!this.coverPreview();
    const coverControl = this.form.get('coverImageBase64')!;
    coverControl.setErrors(hasCover ? null : { required: true });
  }

  togglePreview() {
    this.previewMode.set(!this.previewMode());
  }

  getErrorMessage(errors: any): string {
    if (!errors) return '';
    if (errors.required) return 'This field is required.';
    if (errors.maxlength) return `Maximum ${errors.maxlength.requiredLength} characters.`;
    if (errors.unsafeContent) return 'This text contains content that isn\'t allowed.';
    if (errors.invalidSlugFormat) return 'Use lowercase letters, numbers, and hyphens only (e.g. my-post-title).';
    if (errors.richTextMinLength) return `Content must be at least ${errors.richTextMinLength.required} characters.`;
    return 'This field is invalid.';
  }

  async save(status: 'draft' | 'published') {
    this.form.markAllAsTouched();

    if (status === 'published' && this.form.invalid) {
      this.error.set('Please fix the highlighted fields before publishing.');
      return;
    }

    this.saving.set(true);
    this.saveTarget.set(status);
    this.error.set('');

    try {
      const raw = this.form.value;
      const payload: Omit<Blog, 'id'> = {
        title: stripUnsafeContent(raw.title.trim()),
        slug: stripUnsafeContent(raw.slug.trim()),
        content: this.sanitizeRichTextHtml(raw.content || ''),
        excerpt: stripUnsafeContent(raw.excerpt?.trim()) || this.generateExcerptFromContent(raw.content || ''),
        coverImageBase64: raw.coverImageBase64 || '',
        coverImageUrl: raw.coverImageUrl || '',
        category: raw.category || '',
        author: stripUnsafeContent(raw.author || ''),
        status,
        readTime: raw.readTime || 1,
      };

      if (this.isEdit()) {
        await this.blogService.updateBlog(this.editId()!, payload);
      } else {
        await this.blogService.addBlog(payload);
      }

      await this.router.navigate(['/admin/blog']);
    } catch {
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  private decodeHtmlEntities(html: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }

  private generateExcerptFromContent(html: string): string {
    const withoutTags = html.replace(/<[^>]+>/g, ' ');
    const decoded = this.decodeHtmlEntities(withoutTags);
    const text = decoded.replace(/\s+/g, ' ').trim();

    return text.length > 160 ? text.slice(0, 160).trim() + '…' : text;
  }

  private sanitizeRichTextHtml(html: string): string {
    if (!html) return html;

    // Strip explicit width/height inline styles and attributes that override our CSS
    let cleaned = html
      .replace(/\swidth\s*=\s*["']?\d+["']?/gi, '')
      .replace(/\sheight\s*=\s*["']?\d+["']?/gi, '')
      .replace(/style\s*=\s*"[^"]*width\s*:[^;"]*;?/gi, 'style="')
      .replace(/style\s*=\s*"[^"]*height\s*:[^;"]*;?/gi, 'style="')
      .replace(/style\s*=\s*""/gi, ''); // clean up any now-empty style attrs

    return cleaned;
  }
}