export type BlogStatus = 'draft' | 'published';

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;          // HTML from Quill
  excerpt: string;
  coverImageBase64?: string;
  coverImageUrl?: string;   // Storage URL after migration
  category: string;
  author: string;
  authorIds?: string[];
  guestAuthor?: string;
  guestInterviewed?: boolean;
  status: BlogStatus;
  readTime: number;         // minutes, calculated on save
  createdAt?: any;
  updatedAt?: any;
}
