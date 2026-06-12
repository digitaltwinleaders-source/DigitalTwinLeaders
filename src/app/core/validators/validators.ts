import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ── Sanitizer validator ─────────────────────────────────────────────────
// Blocks script tags, event handler attributes, javascript: URIs, and other
// XSS-prone patterns from plain text fields (title, slug, excerpt — NOT the
// rich text content, which goes through Quill + Angular's DomSanitizer instead)
const DANGEROUS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<[^>]+on\w+\s*=/gi, // onclick=, onerror=, etc.
  /javascript:/gi,
  /<iframe[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /data:text\/html/gi,
];

export function sanitizedTextValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const isUnsafe = DANGEROUS_PATTERNS.some(pattern => pattern.test(value));
    return isUnsafe ? { unsafeContent: true } : null;
  };
}

// ── Slug format validator — strict kebab-case ───────────────────────────
// Valid: "my-post-title", "post-2"
// Invalid: "My Post", "my_post", "my--post", "-my-post", "my-post-"
const KEBAB_CASE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function kebabCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    return KEBAB_CASE_PATTERN.test(value) ? null : { invalidSlugFormat: true };
  };
}

// ── Rich text minimum length — strips HTML tags before counting ────────
export function richTextMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const textOnly = value.replace(/<[^>]+>/g, '').trim();

    return textOnly.length >= minLength
      ? null
      : { richTextMinLength: { required: minLength, actual: textOnly.length } };
  };
}

export function richTextMaxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const textOnly = value.replace(/<[^>]+>/g, '').trim();

    return textOnly.length <= maxLength
      ? null
      : { richTextMinLength: { required: maxLength, actual: textOnly.length } };
  };
}

// ── Reusable sanitize helper (strip rather than reject) ─────────────────
// Used on save as a final defensive pass — validators warn the user,
// this strips anything that slipped through before it ever reaches Firestore
export function stripUnsafeContent(value: string): string {
  if (!value) return value;
  let cleaned = value;
  DANGEROUS_PATTERNS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  return cleaned;
}
