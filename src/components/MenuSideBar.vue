<template>
  <nav class="menu-sidebar">
    <ul>
      <li @click="goTo('account')">
        <span class="icon">👤</span>
        <span class="label">Compte</span>
      </li>
      <li @click="goTo('snippets')">
        <span class="icon">📄</span>
        <span class="label">Snippets</span>
      </li>
      <li @click="goTo('tags')">
        <span class="icon">🏷️</span>
        <span class="label">Tags</span>
      </li>
      <li @click="goTo('favorites')">
        <span class="icon">⭐</span>
        <span class="label">Favoris</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goTo(route: string) {
	const routesMap: Record<string, string> = {
		account: "/account",
		snippets: "/snippets",
		tags: "/tags",
		favorites: "/favorites",
	};
	router.push(routesMap[route] || "/");
}
</script>

<style scoped>
.menu-sidebar {
  width: 220px;
  background: #1c3632; 
  color: #f5f5f5;
  min-height: 100vh;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 6px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.menu-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-sidebar li {
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s, transform 0.2s;
}

.menu-sidebar li:hover {
  background: #24d650;
  color: #1c3632;
  transform: translateX(3px);
}

.menu-sidebar .icon {
  font-size: 1.3rem;
  margin-right: 0.8rem;
  display: flex;
  align-items: center;
}

.menu-sidebar .label {
  font-weight: 600;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .menu-sidebar {
    width: 60px;
    padding: 1rem 0.5rem;
  }

  .menu-sidebar li {
    justify-content: center;
  }

  .menu-sidebar .label {
    display: none;
  }

  .menu-sidebar .icon {
    margin: 0;
  }
}
</style>
