import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'     
import SnippetsList from '../pages/SnippetsList.vue'
import AuthForm from '../pages/AuthForm.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import SnippetsDetail from '../pages/SnippetsDetail.vue'
import UserProfile from '../pages/UserProfile.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: SnippetsList },
      { path: 'snippets', component: SnippetsList },
      { path: 'tags', component: SnippetsList },
      { path: 'account', component: UserProfile },
      { path: 'favorites', component: SnippetsList },
      { path: 'snippets/:id', name: 'SnippetDetail', component: SnippetsDetail },
    ],
  },
{
  path: '/auth',
  component: AuthLayout,
  children: [
    { path: '', component: AuthForm }, 
    { path: 'login', component: AuthForm },
    { path: 'signup', component: AuthForm },
  ],
}

];

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
