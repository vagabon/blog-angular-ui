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
        path: 'notification/**',
        renderMode: RenderMode.Client,
    },
    {
        path: 'profil/**',
        renderMode: RenderMode.Client,
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
