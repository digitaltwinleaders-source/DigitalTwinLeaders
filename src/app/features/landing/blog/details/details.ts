import { Component, inject, signal, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../../../core/services/blog.service';
import { Blog } from '../../../../core/models/blog.model';
import { SeoService } from '../../../../core/services/seo.service';


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
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  blog = signal<Blog | null>(null);
  loading = signal(true);
  prevPost = signal<Blog | null>(null);
  nextPost = signal<Blog | null>(null);

  safeContent = () => {
    const content = this.blog()?.content || '';
    const wrappingContent = content.replace(/(?:\u00a0|&nbsp;|&#0*160;|&#x0*a0;)/gi, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(wrappingContent);
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const blog = this.route.snapshot.data['blog'] as Blog | null;
      if (blog) {
        this.setBlog(blog);
        return;
      }

      const slug = params.get('slug');
      if (slug && isPlatformBrowser(this.platformId)) {
        this.loading.set(true);
        this.blog.set(null);
        this.blogService.getBlogBySlug(slug)
          .then(result => {
            if (this.route.snapshot.paramMap.get('slug') === slug) {
              this.setBlog(result);
            }
          })
          .catch(err => {
            if (this.route.snapshot.paramMap.get('slug') === slug) {
              console.error('🔴 getBlogBySlug failed:', err);
              this.setBlog(null);
            }
          });
        return;
      }

      this.setBlog(null);
    });
  }

  private setBlog(blog: Blog | null) {
    this.blog.set(blog);
    this.prevPost.set(null);
    this.nextPost.set(null);
    this.loading.set(false);

    if (!blog) return;
    const createdAtDate = blog.createdAt
      ? typeof blog.createdAt.toDate === 'function'
        ? blog.createdAt.toDate()
        : new Date(blog.createdAt)
      : null;

    this.seo.update({
      title: blog.title,
      description: blog.excerpt || blog.title,
      image: blog.coverImageUrl,
      url: `/blog/${blog.slug}/`,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: blog.excerpt || blog.title,
        author: blog.author
          ? blog.author.split(',').map(name => name.trim()).filter(Boolean).map(name => ({
              '@type': 'Person',
              name,
            }))
          : undefined,
        image: blog.coverImageUrl || undefined,
        datePublished: createdAtDate && !Number.isNaN(createdAtDate.getTime())
          ? createdAtDate.toISOString()
          : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'Digital Twin Leaders',
          logo: { '@type': 'ImageObject', url: 'https://www.digitaltwinleaders.com/assets/logo.png' },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.digitaltwinleaders.com/blog/${blog.slug}/`,
        },
      },
    });

    if (blog.createdAt && isPlatformBrowser(this.platformId)) {
      this.blogService.getAdjacentBlogs(blog.createdAt)
        .then(adjacent => {
          this.prevPost.set(adjacent.prev);
          this.nextPost.set(adjacent.next);
        })
        .catch(err => {
          console.warn('🟡 getAdjacentBlogs failed (non-fatal):', err);
        });
    }
  }

  formatDate(ts: any): string {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  hasDisplayAuthor(): boolean {
    const blog = this.blog();
    if (!blog) return false;

    if (blog.authorIds !== undefined || blog.guestAuthor !== undefined) {
      return !!blog.authorIds?.some(Boolean) || !!blog.guestAuthor?.trim();
    }

    return !!blog.author?.trim();
  }
}