import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

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
                path: 'council',
                loadComponent: () =>
                    import('./features/landing/council/council')
                        .then(m => m.CouncilComponent)
            },
            {
                path: 'institute',
                loadComponent: () =>
                    import('./features/landing/full-institute/full-institute')
                        .then(m => m.FullInstitute)
            },
            {
                path: 'project-planner',
                loadComponent: () =>
                    import('./features/landing/institute-planner/institute-planner')
                        .then(m => m.InstitutePlanner)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
