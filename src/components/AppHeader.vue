<template>
  <header class="app-header">
    <div class="logo" @click="goHome">
      <span>📚 Biblio<span class="title-color">Tech</span></span>
    </div>
    <SearchBar />
    <LogoutBtn />
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import LogoutBtn from "../components/LogoutBtn.vue";
import SearchBar from "../components/SearchBar.vue";

const router = useRouter();

function goHome() {
	router.push({ name: "Home" });
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #18534f;
  color: #fff;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 8px #0002;
}

.logo {
  cursor: pointer;
}

.logo span {
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  gap: 1.6rem;
}

.main-nav a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.main-nav a.router-link-active {
  color: #ffb4a2;
}

.title-color {
  color: #24d650;
}
</style>
