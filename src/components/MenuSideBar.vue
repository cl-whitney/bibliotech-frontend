<template>
  <nav class="menu-sidebar">
    <ul>
      <li @click="goTo('account')">
        <span class="icon">👤</span>
        <span>Compte</span>
      </li>
      <li @click="goTo('snippets')">
        <span class="icon">📂</span>
        <span>Tous les snippets</span>
      </li>
      <li @click="goTo('tags')">
        <span class="icon">🏷️</span>
        <span>Mes tags</span>
      </li>
      <li @click="goTo('favorites')">
        <span class="icon">⭐</span>
        <span>Favoris</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goTo(route: string) {
  switch(route) {
    case 'account':
      router.push('/account');
      break;
    case 'snippets':
      router.push('/snippets');
      break;
    case 'tags':
      router.push('/tags');
      break;
    case 'favorites':
      router.push('/favorites');
      break;
  }
}
</script>

<style scoped>
.menu-sidebar {
  width: 200px;
  background: #2d2d2d;
  color: #fff;
  height: 100vh;
  padding: 1rem;
}

.menu-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-sidebar li {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.menu-sidebar li:hover {
  background: #424242;
}

.menu-sidebar .icon {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}
</style>
