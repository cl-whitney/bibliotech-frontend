<template>
  <section class="favorites-section">
    <div class="header">
      <h2 class="page-title">Mes favoris</h2>
      <input
        type="text"
        placeholder="Rechercher un snippet..."
        v-model="searchQuery"
        class="search-input"
      />
    </div>

    <div v-if="loading" class="status-text">Chargement...</div>
    <div v-else-if="error" class="status-text error">{{ error }}</div>
    <div v-else-if="filteredFavorites.length === 0" class="status-text">
      Aucun snippet trouvé.
    </div>

    <ul class="snippet-list" v-else>
      <SnippetCard
        v-for="snippet in filteredFavorites"
        :key="snippet.id"
        :snippet="snippet"
      />
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchAllSnippets } from "../api/snippetsApi";
import SnippetCard from "../components/SnippetCard.vue";
import type { Snippet } from "../types/types";

const searchQuery = ref("");
const allSnippets = ref<Snippet[]>([]);
const favorites = ref<number[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Récupère les favoris depuis localStorage
function loadFavorites() {
	const fav = localStorage.getItem("favorites");
	favorites.value = fav ? JSON.parse(fav) : [];
}

// Filtre les snippets selon favoris + recherche
const filteredFavorites = computed(() => {
	return allSnippets.value
		.filter((s) => favorites.value.includes(s.id))
		.filter((s) => {
			const query = searchQuery.value.toLowerCase();
			return (
				s.title.toLowerCase().includes(query) ||
				(s.description?.toLowerCase().includes(query) ?? false)
			);
		});
});

async function loadSnippets() {
	loading.value = true;
	error.value = null;

	try {
		const data = await fetchAllSnippets();
		allSnippets.value = data.map((s) => ({
			...s,
			created_at: new Date(s.created_at),
			updated_at: s.updated_at ? new Date(s.updated_at) : undefined,
		}));
	} catch (e: any) {
		error.value = e.message || "Erreur lors de la récupération des snippets";
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	loadFavorites();
	loadSnippets();
});
</script>

<style scoped>
.favorites-section[data-v-fabe37e6] {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 auto;
    padding: 1rem;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  /* gap: 1rem; */
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #24d650;
}

.search-input {
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: #0e403e;
  color: #f5f5f5;
  flex-grow: 1;
  min-width: 200px;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #a7e4b2;
}

.status-text {
  color: #f5f5f5;
  text-align: center;
}

.status-text.error {
  color: #ff5c5c;
}

.snippet-list {
  list-style: none;
  padding: 0;
  margin-top: 0;
  /* display: grid;
  grid-template-columns: repeat(3, 1fr); */
  gap: 1rem;
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
