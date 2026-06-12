import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models/blog.model';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './blog-list.html',
  styleUrls: ['./blog-list.scss']
})
export class AdminBlogListComponent implements OnInit {
  blogService = inject(BlogService);
  blogs = signal<Blog[]>([]);
  loading = signal(true);
  deleteTarget = signal<Blog | null>(null);
  deleting = signal(false);
  deleteError = signal('');

  ngOnInit() {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => { this.blogs.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  confirmDelete(blog: Blog) { this.deleteTarget.set(blog); }

  async deleteBlog() {
    const target = this.deleteTarget();
    if (!target) return;

    this.deleting.set(true);
    this.deleteError.set('');
    try {
      await this.blogService.deleteBlog(target.id!);
      this.blogs.update(list => list.filter(b => b.id !== target.id));
      this.deleteTarget.set(null);
    } catch (err) {
      console.error('Failed to delete blog:', err);
      this.deleteError.set('Failed to delete post. Please try again.');
    } finally {
      this.deleting.set(false);
    }
  }

  formatDate(ts: any): string {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}