import {
  Component, inject, signal, OnInit, SecurityContext
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JoditAngularComponent, type JoditConfig } from 'jodit-angular';
import type { Jodit } from 'jodit';
import { BlogService } from '../../../core/services/blog.service';
import { ImageService } from '../../../core/services/image.service';
import { AuthService } from '../../../core/services/auth.service';
import { CouncilService } from '../../../core/services/council.service';
import { CouncilMember } from '../../../core/models/council-member.model';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, JoditAngularComponent],
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
  private councilService = inject(CouncilService);

  titleMaxLength = TITLE_MAX_LENGTH;
  slugMaxLength = SLUG_MAX_LENGTH;
  excerptMaxLength = EXCERPT_MAX_LENGTH;
  authorMaxLength = AUTHOR_MAX_LENGTH;

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
  councilMembers = signal<CouncilMember[]>([]);
  authorDropdownOpen = signal(false);
  legacyAuthorOnly = signal(false);
  publishValidationErrors = signal<string[]>([]);

  readonly NEW_CATEGORY_SENTINEL = '__add_new__';
  private joditEditorInstance: Jodit | null = null;

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
    author: ['', [sanitizedTextValidator()]],
    readTime: [1, [Validators.min(1)]],
    status: ['draft'],
    authorIds: [[]],
    guestAuthor: ['', [Validators.maxLength(AUTHOR_MAX_LENGTH), sanitizedTextValidator()]],
    guestInterviewed: [false],
    coverImageBase64: ['', [Validators.required]],
    coverImageUrl: ['']
  });

  get titleControl() { return this.form.get('title')!; }
  get slugControl() { return this.form.get('slug')!; }
  get contentControl() { return this.form.get('content')!; }
  get excerptControl() { return this.form.get('excerpt')!; }
  get categoryControl() { return this.form.get('category')!; }
  get authorControl() { return this.form.get('author')!; }

  joditConfig: JoditConfig = {
    width: '100%',
    height: 500,
    minHeight: 480,
    placeholder: 'Write your blog content here...',
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    countTextSpaces: true,
    processPasteHTML: true,
    processPasteFromWord: true,
    cleanHTML: {
      allowedStyles: false,
      removeEventAttributes: true,
      safeJavaScriptLink: true,
      safeLinksTarget: true
    },
    removeButtons: ['image'],
    extraButtons: [{
      name: 'uploadBlogImage',
      icon: 'image',
      tooltip: 'Upload image',
      exec: () => this.triggerImageUpload()
    }]
  };

  // formValid signal removed entirely — form.invalid (from FormGroup) replaces it
  // and updates automatically via Angular's reactive forms change stream,
  // which is what fixes the "doesn't update until I touch another field" bug

  safeContent = (): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(this.contentControl.value || '');

  async ngOnInit() {
    this.councilService.getMembers().subscribe({
      next: (members) => this.councilMembers.set(members),
      error: () => this.councilMembers.set([])
    });
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
        this.legacyAuthorOnly.set(blog.authorIds === undefined && blog.guestAuthor === undefined);
        this.form.patchValue({
          ...blog,
          content: this.normalizeNonBreakingSpaces(blog.content || ''),
          authorIds: blog.authorIds || [],
          guestAuthor: blog.guestAuthor || '',
          guestInterviewed: blog.guestInterviewed || false
        });
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
    this.form.valueChanges.subscribe(() => {
      if (this.publishValidationErrors().length) {
        this.publishValidationErrors.set(this.getPublishValidationErrors());
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

  onContentChanged(event: { editor: Jodit }) {
    const readTime = this.blogService.calculateReadTime(event.editor.text);
    this.form.patchValue({ readTime }, { emitEvent: false });
    this.contentControl.markAsTouched();
    this.contentControl.updateValueAndValidity();
  }

  onEditorCreated(editor: Jodit) {
    this.joditEditorInstance = editor;
  }

  toggleAuthor(memberId: string): void {
    const selected = this.form.value.authorIds as string[] || [];
    this.form.patchValue({
      authorIds: selected.includes(memberId)
        ? selected.filter(id => id !== memberId)
        : [...selected, memberId]
    });
  }

  isAuthorSelected(memberId: string): boolean {
    return (this.form.value.authorIds as string[] || []).includes(memberId);
  }

  toggleAuthorDropdown(): void {
    this.authorDropdownOpen.update(open => !open);
  }

  closeAuthorDropdown(): void {
    this.authorDropdownOpen.set(false);
  }

  getSelectedAuthorNames(): string[] {
    const selected = this.form.value.authorIds as string[] || [];
    return this.councilMembers()
      .filter(member => selected.includes(member.id!))
      .map(member => member.name);
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
    const editor = this.joditEditorInstance;
    if (!editor) return;

    editor.s.save();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void this.handleInlineImage(file, editor);
      else editor.s.restore();
      input.remove();
    };
    input.addEventListener('cancel', () => {
      editor.s.restore();
      input.remove();
    }, { once: true });
    input.click();
  }

  private async handleInlineImage(file: File, editor: Jodit) {
    this.inlineImageError.set('');
    this.inlineImageUploading.set(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    let selectionSaved = true;

    try {
      const base64 = await this.imageService.compressAndConvertToBase64Cover(file);
      editor.s.restore();
      selectionSaved = false;
      editor.s.insertImage(base64);
    } catch (err: any) {
      this.inlineImageError.set(err.message || 'Failed to upload image. Please try a smaller file.');
    } finally {
      if (selectionSaved) editor.s.restore();
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
    if (this.publishValidationErrors().length) {
      this.publishValidationErrors.set(this.getPublishValidationErrors());
    }
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
    if (errors.richTextMaxLength) return `Content must be no more than ${errors.richTextMaxLength.required} characters.`;
    return 'This field is invalid.';
  }

  private getPublishValidationErrors(): string[] {
    const fields = [
      ['title', 'Title'],
      ['slug', 'Slug'],
      ['content', 'Article content'],
      ['excerpt', 'Excerpt'],
      ['category', 'Category'],
      ['guestAuthor', 'Guest author'],
      ['readTime', 'Read time'],
      ['coverImageBase64', 'Cover image']
    ] as const;

    return fields.flatMap(([controlName, label]) => {
      const control = this.form.get(controlName);
      return control?.invalid
        ? [`${label}: ${this.getErrorMessage(control.errors)}`]
        : [];
    });
  }

  async save(status: 'draft' | 'published') {
    this.form.markAllAsTouched();

    if (status === 'published' && this.form.invalid) {
      this.error.set('');
      this.publishValidationErrors.set(this.getPublishValidationErrors());
      return;
    }

    this.saving.set(true);
    this.saveTarget.set(status);
    this.error.set('');
    this.publishValidationErrors.set([]);

    try {
      const raw = this.form.value;
      const authorIds = (raw.authorIds as string[] || []).filter(Boolean);
      const guestAuthor = stripUnsafeContent(raw.guestAuthor?.trim() || '');
      const selectedAuthors = this.councilMembers()
        .filter(member => authorIds.includes(member.id!))
        .map(member => member.name);
      const authorNames = [...selectedAuthors, ...(guestAuthor ? [guestAuthor] : [])];
      const payload: Omit<Blog, 'id'> = {
        title: stripUnsafeContent(raw.title.trim()),
        slug: stripUnsafeContent(raw.slug.trim()),
        content: this.normalizeNonBreakingSpaces(raw.content || ''),
        excerpt: stripUnsafeContent(raw.excerpt?.trim()) || this.generateExcerptFromContent(raw.content || ''),
        coverImageBase64: raw.coverImageBase64 || '',
        coverImageUrl: raw.coverImageUrl || '',
        category: raw.category || '',
        author: authorNames.join(', ')
          || (this.legacyAuthorOnly() ? stripUnsafeContent(raw.author || '') : ''),
        authorIds,
        guestAuthor,
        guestInterviewed: !!raw.guestInterviewed && !!guestAuthor,
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

  private normalizeNonBreakingSpaces(html: string): string {
    return html.replace(/&nbsp;|&#0*160;|&#x0*a0;|\u00a0/gi, ' ');
  }

  private generateExcerptFromContent(html: string): string {
    const withoutTags = html.replace(/<[^>]+>/g, ' ');
    const decoded = this.decodeHtmlEntities(withoutTags);
    const text = decoded.replace(/\s+/g, ' ').trim();

    return text.length > 160 ? text.slice(0, 160).trim() + '…' : text;
  }

}