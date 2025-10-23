import { createRouter, createWebHistory } from 'vue-router';
import SnippetsList from '../components/SnippetsList.vue';

const routes = [
  { path: '/', component: SnippetsList },
  { path: '/snippets', component: SnippetsList },
  { path: '/tags', component: SnippetsList }, // placeholder
  { path: '/account', component: SnippetsList }, // placeholder
  { path: '/favorites', component: SnippetsList }, // placeholder
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
