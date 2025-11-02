<script setup lang="ts">
import { useRouter } from "vue-router";
import { logoutUser } from "../api/useAuth";

const router = useRouter();

async function handleLogout() {
	try {
		await logoutUser();
		router.push("/auth");
	} catch (err: any) {
		console.error("Erreur logout:", err.message || err);
	}
}
</script>

<template>
  <button @click="handleLogout" class="logout-btn">Déconnexion</button>
</template>

<style scoped>
.logout-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #e53e3e;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background-color: #c53030;
}
</style>
