import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const { getPublishedSlugs } = await import('./core/utils/prerender-routes');
      return getPublishedSlugs();
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
