import { createRouter, createWebHistory } from 'vue-router';

const SearchPage = () => import('@/pages/SearchPage.vue');
const NowPlayingPage = () => import('@/pages/NowPlayingPage.vue');
const QueuePage = () => import('@/pages/QueuePage.vue');
const PlaylistsPage = () => import('@/pages/PlaylistsPage.vue');
const FavoritesPage = () => import('@/pages/FavoritesPage.vue');
const SettingsPage = () => import('@/pages/SettingsPage.vue');

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/search' },
        { path: '/search', component: SearchPage },
        { path: '/now-playing', component: NowPlayingPage },
        { path: '/queue', component: QueuePage },
        { path: '/playlists', component: PlaylistsPage },
        { path: '/favorites', component: FavoritesPage },
        { path: '/settings', component: SettingsPage },
    ],
});
