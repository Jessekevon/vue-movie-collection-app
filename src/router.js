import { createRouter, createWebHistory } from 'vue-router';

import MovieCollections from './views/MovieCollections.vue';
import MovieSearch from './views/MovieSearch.vue';

const routes = [
    {
        path: '/',
        name: 'movie-search',
        component: MovieSearch,
    },
    {
        path: '/collections',
        name: 'collections',
        component: MovieCollections,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
