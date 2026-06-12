import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../../../core/services/blog.service';
import { Blog } from '../../../../core/models/blog.model';
import { nameInitial } from '../../../../core/utils/utils';


@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.html',
  styleUrls: ['./details.scss']
})
export class BlogDetailComponent implements OnInit {
  blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  blog = signal<Blog | null>(null);
  loading = signal(true);
  prevPost = signal<Blog | null>(null);
  nextPost = signal<Blog | null>(null);

  safeContent = () =>
    this.sanitizer.bypassSecurityTrustHtml(this.blog()?.content || '');

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      console.log('🔍 Slug from route:', slug);

      if (!slug) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.blog.set(null);
      this.prevPost.set(null);
      this.nextPost.set(null);

      try {
        console.log('🔍 Attempting getBlogBySlug for:', slug);
        const blog = await this.blogService.getBlogBySlug(slug);
        console.log('✅ getBlogBySlug succeeded:', blog);
        this.blog.set(blog);
        this.loading.set(false);

        if (blog?.createdAt) {
          try {
            console.log('🔍 Attempting getAdjacentBlogs');
            const adjacent = await this.blogService.getAdjacentBlogs(blog.createdAt);
            console.log('✅ getAdjacentBlogs succeeded:', adjacent);
            this.prevPost.set(adjacent.prev);
            this.nextPost.set(adjacent.next);
          } catch (err) {
            console.warn('🟡 getAdjacentBlogs failed (non-fatal):', err);
          }
        }
      } catch (err) {
        console.error('🔴 getBlogBySlug failed:', err);
        this.blog.set(null);
        this.loading.set(false);
      }
    });
  }

  formatDate(ts: any): string {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  nameInitial(authorName: string): string {
    return nameInitial(authorName);
  }
}