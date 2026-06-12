import {
  Component, inject, signal, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { BlogService } from '../../../../core/services/blog.service';
import { Blog } from '../../../../core/models/blog.model';
import { Subscribe } from '../../../../shared/components/subscribe/subscribe';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Subscribe],
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {
  blogService = inject(BlogService);

  featuredBlog = signal<Blog | null>(null);
  recentBlogs = signal<Blog[]>([]);
  categories = signal<string[]>([]);
  blogs = signal<Blog[]>([]);          // what's actually rendered in the grid

  loadingBlogs = signal(true);
  hasMore = signal(false);
  currentPage = signal(1);
  activeCategory = signal<string | null>(null);

  // Search is now a distinct mode, not a filter layered on top of pagination
  isSearchMode = signal(false);

  searchQuery = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private pageStack: (QueryDocumentSnapshot | null)[] = [null];

  async ngOnInit() {
    this.blogService.getFeaturedBlog().pipe(takeUntil(this.destroy$)).subscribe(b => {
      this.featuredBlog.set(b);
      this.blogService.getRecentBlogs(4, b?.id).pipe(takeUntil(this.destroy$)).subscribe(r => this.recentBlogs.set(r));
      this.loadPage();
    });

    this.blogService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(c => this.categories.set(c));

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => this.applySearch(term));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(term: string) {
    this.activeCategory.set(null);
    this.pageStack = [null];
    this.currentPage.set(1);
    this.searchSubject.next(term);
  }
  clearSearch() {
    this.searchQuery = '';
    this.isSearchMode.set(false);
    // Restore whatever the current category/pagination state should show
    this.loadPage();
  }

  // Category and search are mutually exclusive — picking a category
  // always exits search mode and clears the query, since "browse by
  // category" and "search everything" are two different ways of
  // navigating, not two filters meant to stack on top of each other.
  setCategory(cat: string | null) {
    this.searchQuery = '';
    this.isSearchMode.set(false);
    this.activeCategory.set(cat);
    this.pageStack = [null];
    this.currentPage.set(1);
    this.loadPage();
  }

  async nextPage() {
    if (this.isSearchMode()) return; // search results aren't paginated
    const lastDoc = this.pageStack[this.pageStack.length - 1];
    await this.loadPage(lastDoc ?? undefined);
  }

  async prevPage() {
    if (this.isSearchMode()) return;
    if (this.currentPage() <= 1) return;
    this.pageStack.pop();
    this.pageStack.pop();
    const lastDoc = this.pageStack[this.pageStack.length - 1];
    await this.loadPage(lastDoc ?? undefined, true);
  }

  private async loadPage(lastDoc?: QueryDocumentSnapshot, isPrev = false) {
    this.loadingBlogs.set(true);
    try {
      const excludeId = !this.activeCategory() ? this.featuredBlog()?.id : undefined;

      const result = await this.blogService.getPublishedPage(
        lastDoc,
        this.activeCategory() || undefined,
        excludeId
      );
      this.blogs.set(result.blogs);
      this.hasMore.set(result.hasMore);

      if (!isPrev) {
        if (result.lastDoc) this.pageStack.push(result.lastDoc);
        if (lastDoc) this.currentPage.update(p => p + 1);
      } else {
        this.currentPage.update(p => p - 1);
      }
    } finally {
      this.loadingBlogs.set(false);
    }
  }

  // Search now fetches against the FULL published collection, not
  // whatever happened to be on the currently loaded page — this is
  // what actually fixes "search can't find posts that exist"
  private async applySearch(term: string) {
    const trimmed = term.trim();

    if (!trimmed) {
      this.isSearchMode.set(false);
      this.loadPage();
      return;
    }

    this.isSearchMode.set(true);
    this.loadingBlogs.set(true);

    try {
      const allPosts = await this.blogService.getAllPublishedForSearch();
      const lower = trimmed.toLowerCase();

      const results = allPosts.filter(b =>
        b.title.toLowerCase().includes(lower) ||
        b.excerpt.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower)
      );

      this.blogs.set(results);
      this.hasMore.set(false); // search results show in full, no pagination
    } finally {
      this.loadingBlogs.set(false);
    }
  }

  formatDate(ts: any): string {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
