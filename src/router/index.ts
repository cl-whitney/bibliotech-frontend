import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'     
import SnippetsList from '../pages/SnippetsList.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: SnippetsList },            
      { path: 'snippets', component: SnippetsList },
      { path: 'tags', component: SnippetsList },
      { path: 'account', component: SnippetsList },
      { path: 'favorites', component: SnippetsList }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
