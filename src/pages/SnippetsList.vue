<template>
  <section class="snippets-section">
    <div class="header">
      <h2 class="page-title">Tous les snippets</h2>
      <button class="create-btn" @click="goToCreate">+ Nouveau snippet</button>
    </div>

    <div v-if="loading" class="status-text">Chargement...</div>
    <div v-else-if="error" class="status-text error">{{ error }}</div>

    <ul class="snippet-list" v-else>
      <SnippetCard
        v-for="snippet in snippets"
        :key="snippet.id"
        :snippet="snippet"
      />
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchAllSnippets } from "../api/snippetsApi";
import SnippetCard from "../components/SnippetCard.vue";
import type { Snippet } from "../types/types";

const snippets = ref<Snippet[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const router = useRouter();

async function fetchSnippets() {
	loading.value = true;
	error.value = null;
	try {
		const data = await fetchAllSnippets();
		snippets.value = data.map((s) => ({
			...s,
			created_at: new Date(s.created_at),
			updated_at: s.updated_at ? new Date(s.updated_at) : undefined,
		}));
	} catch (e: any) {
		error.value = e.message || "Erreur inconnue";
	} finally {
		loading.value = false;
	}
}

function goToCreate() {
	router.push({ name: "SnippetForm" });
}

onMounted(fetchSnippets);
</script>

<style scoped>
.snippets-section[data-v-2b2786a0] {
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #24d650;
}

.create-btn {
  background-color: #24d650;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.create-btn:hover {
  background-color: #1bb545;
}

.status-text {
  color: #f5f5f5;
  text-align: center;
}

.status-text.error {
  color: #ff5c5c;
}

.snippet-list[data-v-2b2786a0] {
    list-style: none;
    padding: 0;
    margin-top: 0;
    /* display: grid; */
    /* grid-template-columns: repeat(3, 1fr); */
    /* gap: 1rem; */
    flex-wrap: wrap;
}

@media (max-width: 900px) {
  .snippet-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .snippet-list {
    grid-template-columns: 1fr;
  }
}
</style>
