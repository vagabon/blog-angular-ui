import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Server,
    },
    {
        path: 'news/**',
        renderMode: RenderMode.Server,
    },
    {
        path: 'admin/**',
        renderMode: RenderMode.Client,
    },
    {
        path: '**',
        renderMode: RenderMode.Server,
    },
];
