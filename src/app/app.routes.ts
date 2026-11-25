import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResolveFn, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { Blog } from './core/models/blog.model';
import { BlogService } from './core/services/blog.service';

const blogResolver: ResolveFn<Blog | null> = route => {
    const slug = route.paramMap.get('slug');
    if (!slug || isPlatformBrowser(inject(PLATFORM_ID))) return null;
    return inject(BlogService).getBlogBySlug(slug);
};

export const routes: Routes = [
    // ── Admin routes ──────────────────────
    {
        path: 'admin/login',
        loadComponent: () =>
            import('./features/admin/login/login')
                .then(m => m.AdminLoginComponent)
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./features/admin/layout/layout')
                .then(m => m.AdminLayoutComponent),
        children: [
            {
                path: 'council',
                loadComponent: () =>
                    import('./features/admin/council/council')
                        .then(m => m.AdminCouncilComponent)
            },
            { path: 'blog', loadComponent: () => import('./features/admin/blog-list/blog-list').then(m => m.AdminBlogListComponent) },
            { path: 'blog/new', loadComponent: () => import('./features/admin/blog-editor/blog-editor').then(m => m.AdminBlogEditorComponent) },
            { path: 'blog/edit/:id', loadComponent: () => import('./features/admin/blog-editor/blog-editor').then(m => m.AdminBlogEditorComponent) },
            {
                path: '',
                redirectTo: 'council',
                pathMatch: 'full'
            }
        ]
    },
    // ── Public Routes ─────────────────────
    {
        path: '',
        loadComponent: () =>
            import('./layout/layout').then(m => m.Layout),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/landing/landing').then(m => m.Landing)
            },
            {
                path: 'knowledge-hub',
                loadComponent: () =>
                    import('./features/landing/full-institute/full-institute')
                        .then(m => m.FullInstitute)
            },
            {
                path: 'project-planner',
                loadComponent: () =>
                    import('./features/landing/institute-planner/institute-planner')
                        .then(m => m.InstitutePlanner)
            },
            {
                path: 'blog',
                loadComponent: () =>
                    import('./features/landing/blog/list/list').then(m => m.BlogListComponent)
            },
            {
                path: 'blog/:slug',
                resolve: { blog: blogResolver },
                loadComponent: () =>
                    import('./features/landing/blog/details/details').then(m => m.BlogDetailComponent)
            },
            {
                path: 'membership',
                loadComponent: () =>
                    import('./features/landing/membership/membership').then(m => m.Membership)
            },
            {
                path: 'council',
                loadComponent: () =>
                    import('./features/landing/council/council').then(m => m.CouncilComponent)
            },
            {
                path: 'terms',
                loadComponent: () =>
                    import('./features/legal/terms/terms').then(m => m.Terms)
            },
            {
                path: 'refund-policy',
                loadComponent: () =>
                    import('./features/legal/refund-policy/refund-policy').then(m => m.RefundPolicy)
            },
            {
                path: 'privacy',
                loadComponent: () =>
                    import('./features/legal/privacy/privacy').then(m => m.Privacy)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
