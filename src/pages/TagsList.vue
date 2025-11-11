<template>
  <section class="tags-section">
    <h2 class="page-title">Tous les tags</h2>

    <form class="create-tag-form" @submit.prevent="createTag">
      <input
        v-model="newTagName"
        type="text"
        placeholder="Nom du tag"
        required
        class="tag-input"
      />
      <button type="submit" class="create-btn" :disabled="creating">
        {{ creating ? "Création..." : "Créer le tag" }}
      </button>
    </form>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Rechercher un tag..."
      class="search-input"
    />

    <div v-if="loading" class="status-text">Chargement...</div>
    <div v-else-if="error" class="status-text error">{{ error }}</div>

    <ul class="tag-list" v-if="filteredTags.length">
      <TagCard
        v-for="tag in filteredTags"
        :key="tag.id"
        :tag="tag"
        @deleted="removeTag"
      />
    </ul>
    <div v-else class="status-text">Aucun tag trouvé</div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
	createTag as apiCreateTag,
	deleteTag as apiDeleteTag,
	fetchAllTags,
} from "../api/tagsApi";
import TagCard from "../components/TagCard.vue";
import type { Tag } from "../types/types";

const tags = ref<Tag[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const newTagName = ref("");
const creating = ref(false);
const searchQuery = ref("");

async function fetchTags() {
	loading.value = true;
	error.value = null;
	try {
		const data = await fetchAllTags();
		tags.value = data.map((t) => ({
			...t,
			created_at: new Date(t.created_at),
			updated_at: t.updated_at ? new Date(t.updated_at) : undefined,
		}));
	} catch (e: any) {
		error.value = e.message || "Erreur inconnue";
	} finally {
		loading.value = false;
	}
}

async function createTag() {
	if (!newTagName.value.trim()) return;
	creating.value = true;
	error.value = null;

	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Utilisateur non authentifié");

		const newTag = await apiCreateTag({ name: newTagName.value }, token);
		tags.value.unshift({
			...newTag,
			created_at: new Date(newTag.created_at),
			updated_at: newTag.updated_at ? new Date(newTag.updated_at) : undefined,
		});
		newTagName.value = "";
	} catch (e: any) {
		error.value = e.message || "Erreur lors de la création du tag";
	} finally {
		creating.value = false;
	}
}

async function removeTag(id: number) {
	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Utilisateur non authentifié");

		await apiDeleteTag(id, token);
		tags.value = tags.value.filter((t) => t.id !== id);
	} catch (e: any) {
		alert(e.message || "Erreur lors de la suppression du tag");
	}
}

const filteredTags = computed(() =>
	tags.value.filter((tag) =>
		tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
	),
);

onMounted(fetchTags);
</script>

<style scoped>
.tags-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.page-title {
  color: #24d650;
  font-size: 1.8rem;
  font-weight: 700;
}

.create-tag-form {
  display: flex;
  gap: 0.5rem;
}

.tag-input,
.search-input {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: #0e403e;
  color: #f5f5f5;
  font-size: 1rem;
  outline: navy;
}

.tag-input::placeholder,
.search-input::placeholder {
  color: #a7e4b2;
}

.create-btn {
  background-color: #24d650;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover:not(:disabled) {
  background-color: #1bb545;
}

.create-btn:disabled {
  background-color: #136c2d;
  cursor: not-allowed;
}

.status-text {
  color: #f5f5f5;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
}

.status-text.error {
  color: #ff5c5c;
}

.tag-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .tag-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .tag-list {
    grid-template-columns: 1fr;
  }
}
</style>
