<template>
  <section class="snippet-form-container">
    <h2 class="page-title">Nouveau snippet</h2>

    <div v-if="selectedTags.length" class="selected-tags">
      <span v-for="id in selectedTags" :key="id" class="tag">
        {{ getTagNameById(id) }}
      </span>
    </div>

    <form @submit.prevent="submitForm" class="snippet-form">
      <div class="form-group">
        <label for="title">Titre</label>
        <input id="title" v-model="title" type="text" placeholder="Titre du snippet" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="description" placeholder="Description (optionnel)"></textarea>
      </div>

      <div class="form-group">
        <label for="code">Code</label>
        <textarea id="code" v-model="code" placeholder="Votre code..." required></textarea>
      </div>

      <div class="form-group">
        <label for="language">Langage</label>
        <select id="language" v-model.number="languageId" required>
          <option value="" disabled>-- Sélectionner un langage --</option>
          <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tags</label>
        <div class="tags-checkboxes">
          <button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            @click="toggleTag(tag)"
            :class="{ active: selectedTags.includes(tag.id) }"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="creating">
          {{ creating ? "Création..." : "Créer le snippet" }}
        </button>
        <button type="button" class="cancel-btn" @click="cancelCreation">Annuler</button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">Snippet créé avec succès !</div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../api/axios";
import { createSnippet } from "../api/snippetsApi";
import type { Language, SnippetInput, Tag } from "../types/types";

const router = useRouter();

const title = ref("");
const description = ref("");
const code = ref("");
const languageId = ref<number | null>(null);
const selectedTags = ref<number[]>([]);

const languages = ref<Language[]>([]);
const tags = ref<Tag[]>([]);

const creating = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

onMounted(() => {
	fetchLanguages();
	fetchTags();
});

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

function toggleTag(tag: Tag) {
	const id = tag.id;
	if (selectedTags.value.includes(id)) {
		selectedTags.value = selectedTags.value.filter((tid) => tid !== id);
	} else {
		selectedTags.value.push(id);
	}
}

function getTagNameById(id: number) {
	const tag = tags.value.find((t) => t.id === id);
	return tag ? tag.name : "";
}

async function submitForm() {
	error.value = null;
	success.value = false;

	const token = localStorage.getItem("token");
	if (!token) {
		error.value = "Utilisateur non authentifié";
		return;
	}

	if (!languageId.value) {
		error.value = "Veuillez sélectionner un langage";
		return;
	}

	if (!title.value.trim()) {
		error.value = "Veuillez saisir un titre";
		return;
	}

	if (!code.value.trim()) {
		error.value = "Veuillez saisir le code";
		return;
	}

	creating.value = true;

	const payload: SnippetInput = {
		title: title.value,
		code: code.value,
		language_id: languageId.value,
		description: description.value.trim() || undefined,
		tagIds: selectedTags.value, 
	};

	try {
		await createSnippet(payload, token);
		success.value = true;

		title.value = "";
		description.value = "";
		code.value = "";
		languageId.value = null;
		selectedTags.value = [];

		setTimeout(() => router.push({ name: "SnippetsList" }), 1000);
	} catch (err: any) {
		error.value = err.message || "Erreur lors de la création";
	} finally {
		creating.value = false;
	}
}

function cancelCreation() {
	router.push({ name: "Home" });
}
</script>

<style scoped>
.snippet-form-container {
  max-width: 800px;
  margin: 40px auto;
  background: #1c3632;
  color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #24d650;
}

.selected-tags {
  margin-bottom: 1rem;
}

.selected-tags .tag {
  background-color: #3498db;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-right: 0.4rem;
  display: inline-block;
}

.snippet-form .form-group {
  margin-bottom: 1rem;
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
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: #0e403e;
  color: #f5f5f5;
  outline: none;
  font-size: 1rem;
}

.snippet-form textarea {
  min-height: 100px;
  resize: vertical;
}

.tags-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags-checkboxes button {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.tags-checkboxes button.active {
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
</style>
