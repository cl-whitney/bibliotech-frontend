import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "../layouts/AuthLayout.vue";
import MainLayout from "../layouts/MainLayout.vue";

import AuthForm from "../pages/AuthForm.vue";
import FavoritesList from "../pages/FavoritesList.vue";

import NotFound from "../pages/NotFound.vue";
import SnippetDetail from "../pages/SnippetDetail.vue";
import SnippetEdit from "../pages/SnippetEdit.vue";
import SnippetForm from "../pages/SnippetForm.vue";

import SnippetsList from "../pages/SnippetsList.vue";
import TagsList from "../pages/TagsList.vue";
import UserProfile from "../pages/UserProfile.vue";

function isLoggedIn(): boolean {
  return false; 
}

const routes = [
  {
    path: "/",
    redirect: () => {
      return isLoggedIn() ? "/snippets" : "/auth";
    },
  },

  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "", name: "Auth", component: AuthForm },
      { path: "login", name: "Login", component: AuthForm },
      { path: "signup", name: "Signup", component: AuthForm },
    ],
  },

  {
    path: "/snippets",
    component: MainLayout,
    children: [
      { path: "", name: "Home", component: SnippetsList }, // ⚡ Home disponible pour router.push
      { path: "snippets", name: "SnippetsList", component: SnippetsList },
      { path: "new", name: "SnippetForm", component: SnippetForm },
      { path: ":id(\\d+)", name: "SnippetDetail", component: SnippetDetail },
      { path: ":id(\\d+)/edit", name: "SnippetEdit", component: SnippetEdit },
      { path: ":pathMatch(.*)*", name: "NotFound", component: NotFound },
    ],
  },

  {
    path: "/tags",
    component: MainLayout,
    children: [{ path: "", name: "TagsList", component: TagsList }],
  },
  {
    path: "/account",
    component: MainLayout,
    children: [{ path: "", name: "UserProfile", component: UserProfile }],
  },
  {
    path: "/favorites",
    component: MainLayout,
    children: [{ path: "", name: "FavoritesList", component: FavoritesList }],
  },

  { path: "/:pathMatch(.*)*", name: "GlobalNotFound", component: NotFound },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
