<template>
  <section class="snippet-form-container">
    <!-- Tags sélectionnés au-dessus du titre -->
    <div v-if="selectedTagIds.length" class="selected-tags">
      <span v-for="id in selectedTagIds" :key="id" class="tag">
        {{ getTagNameById(id) }}
        <button type="button" class="remove-tag" @click="removeTag(id)">×</button>
      </span>
    </div>

    <h2 class="page-title">Modifier le snippet</h2>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <form v-else @submit.prevent="submitForm" class="snippet-form">
      <div class="form-group">
        <label for="title">Titre</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Titre du snippet"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Description (optionnel)"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="code">Code</label>
        <textarea
          id="code"
          v-model="form.code"
          placeholder="Votre code..."
          required
          class="code-textarea"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="language">Langage</label>
        <select id="language" v-model.number="form.language_id" required>
          <option value="" disabled>-- Sélectionner un langage --</option>
          <option v-for="lang in languages" :key="lang.id" :value="lang.id">
            {{ lang.name }}
          </option>
        </select>
      </div>

      <!-- Bloc Tags sous forme de boutons cliquables -->
      <div class="form-group">
        <label>Tags</label>
        <div class="tags-buttons">
          <button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            :class="{ active: selectedTagIds.includes(tag.id) }"
            @click="toggleTag(tag.id)"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="saving">
          {{ saving ? "Mise à jour..." : "Mettre à jour le snippet" }}
        </button>
        <button type="button" class="cancel-btn" @click="cancelEdit">Annuler</button>
      </div>

      <div v-if="success" class="success">Snippet mis à jour avec succès !</div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../api/axios";
import { fetchSnippetById, updateSnippet } from "../api/snippetsApi";
import type { Language, Tag } from "../types/types";

const router = useRouter();
const route = useRoute();
const snippetId = Number(route.params.id);

const form = ref({
	title: "",
	description: "",
	code: "",
	language_id: null as number | null,
});

const languages = ref<Language[]>([]);
const tags = ref<Tag[]>([]);
const selectedTagIds = ref<number[]>([]);
const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

// Supprimer un tag depuis la zone des tags sélectionnés
function removeTag(id: number) {
	selectedTagIds.value = selectedTagIds.value.filter((tid) => tid !== id);
}

// Ajouter/enlever un tag en cliquant
function toggleTag(id: number) {
	if (selectedTagIds.value.includes(id)) {
		removeTag(id);
	} else {
		selectedTagIds.value.push(id);
	}
}

// Récupérer le nom d'un tag
function getTagNameById(id: number) {
	const tag = tags.value.find((t) => t.id === id);
	return tag ? tag.name : "";
}

// Charger le snippet
async function fetchSnippet() {
	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Utilisateur non authentifié");

		const data = await fetchSnippetById(snippetId, token);
		form.value.title = data.title;
		form.value.description = data.description || "";
		form.value.code = data.code;
		form.value.language_id = data.language?.id || null;
		selectedTagIds.value = data.tags?.map((t) => t.id) || [];
	} catch (err: any) {
		error.value = err.message || "Erreur lors du chargement du snippet";
	} finally {
		loading.value = false;
	}
}

// Charger les langages et tags
async function fetchLanguages() {
	try {
		const res = await axios.get<Language[]>("/api/languages");
		languages.value = res.data;
	} catch (err: any) {
		console.error(err);
	}
}

async function fetchTags() {
	try {
		const res = await axios.get<Tag[]>("/api/tags");
		tags.value = res.data.filter((t) => t.status);
	} catch (err: any) {
		console.error(err);
	}
}

// Soumission du formulaire
async function submitForm() {
	error.value = null;
	success.value = false;

	const token = localStorage.getItem("token");
	if (!token) {
		error.value = "Utilisateur non authentifié";
		return;
	}

	if (!form.value.language_id) {
		error.value = "Veuillez sélectionner un langage";
		return;
	}

	saving.value = true;

	try {
		await updateSnippet(
			snippetId,
			{
				title: form.value.title,
				description: form.value.description,
				code: form.value.code,
				language_id: form.value.language_id,
				tagIds: selectedTagIds.value,
			},
			token,
		);
		success.value = true;
		setTimeout(
			() => router.push({ name: "SnippetDetail", params: { id: snippetId } }),
			1000,
		);
	} catch (err: any) {
		error.value = err.message || "Erreur lors de la mise à jour";
	} finally {
		saving.value = false;
	}
}

// Annuler
function cancelEdit() {
	router.back();
}

// Initialisation
onMounted(() => {
	fetchSnippet();
	fetchLanguages();
	fetchTags();
});
</script>

<style scoped>
/* Styles existants conservés */
.snippet-form-container {
  max-width: 800px;
  margin: 40px auto;
  background: #1c3632;
  color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #24d650;
  margin-bottom: 1.5rem;
}

.snippet-form .form-group {
  margin-bottom: 1.2rem;
}

.snippet-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #a7e4b2;
}

.snippet-form input,
.snippet-form select,
.snippet-form textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: #0e403e;
  color: #f5f5f5;
  outline: none;
  font-size: 1rem;
}

.snippet-form textarea.code-textarea {
  font-family: 'Fira Code', monospace;
  min-height: 120px;
  resize: vertical;
}

.tags-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags-buttons button {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.tags-buttons button.active {
  opacity: 0.6;
}

.form-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
}

button[type="submit"] {
  background-color: #24d650;
  border: none;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #1bb847;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

button[disabled] {
  background-color: #136c2d;
  cursor: not-allowed;
}

.error {
  color: #ff5c5c;
  margin-top: 0.5rem;
}

.success {
  color: #24d650;
  margin-top: 0.5rem;
}

.loading {
  color: #f5f5f5;
  font-weight: 500;
}

/* Styles des tags sélectionnés au-dessus du titre */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.selected-tags .tag {
  background-color: #3498db;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.selected-tags .remove-tag {
  background: transparent;
  border: none;
  color: #fff;
  margin-left: 0.3rem;
  cursor: pointer;
  font-weight: bold;
}
</style>
