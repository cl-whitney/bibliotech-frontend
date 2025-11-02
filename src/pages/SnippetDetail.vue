<template>
  <section class="snippet-detail-container">
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="snippet">
      <div class="snippet-header">
        <h2 class="snippet-title">{{ snippet.title }}</h2>
        <div class="header-buttons">
          <button class="edit-btn" @click="editSnippet">✎</button>
          <button class="delete-btn" @click="confirmDelete">✕</button>
        </div>
      </div>

      <div class="snippet-meta">
        <span v-if="snippet.language" class="language-tag">{{ snippet.language.name }}</span>
        <span class="tags">
          <span v-if="snippet.tags && snippet.tags.length">
            <span v-for="tag in snippet.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
          </span>
        </span>
      </div>

      <div class="snippet-description">
        <span class="meta-label">Description: </span>
        <span class="meta-value">{{ snippet.description ?? '-' }}</span>
      </div>

      <!-- Bloc code avec Prism -->
      <div class="snippet-code">
        <pre :class="`language-${snippet.language?.slug || 'javascript'}`">
          <code ref="codeEl" v-html="highlightedCode"></code>
        </pre>
      </div>

      <div class="footer">
        <div>
                  Créé: {{ new Date(snippet.created_at).toLocaleString() }}
        </div>
        <div>
                  Mis à jour: {{ snippet.updated_at ? new Date(snippet.updated_at).toLocaleString() : '-' }}

        </div>
      </div>

      <button @click="goBack">Retour</button>

      <!-- Popup de confirmation -->
      <div v-if="showConfirm" class="confirm-overlay">
        <div class="confirm-box">
          <p>Voulez-vous vraiment supprimer le snippet "<strong>{{ snippet.title }}</strong>" ?</p>
          <div class="confirm-buttons">
            <button @click="deleteSnippet" class="confirm-yes">Oui</button>
            <button @click="showConfirm = false" class="confirm-no">Non</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setAuthToken } from "../api/axios";
import {
	deleteSnippet as apiDeleteSnippet,
	fetchSnippetById,
} from "../api/snippetsApi";
import type { Snippet } from "../types/types";

// Prism.js
import Prism from "../utils/prism-languages";

const route = useRoute();
const router = useRouter();

const snippetId = Number(route.params.id);
const snippet = ref<Snippet | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showConfirm = ref(false);

const codeEl = ref<HTMLElement | null>(null);
const highlightedCode = ref("");

async function fetchSnippet() {
	loading.value = true;
	error.value = null;
	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Utilisateur non authentifié");

		setAuthToken(token);
		snippet.value = await fetchSnippetById(snippetId, token);

		await nextTick();
		if (snippet.value) {
			const lang = snippet.value.language?.slug || "javascript";
			const grammar = Prism.languages[lang]!;
			highlightedCode.value = Prism.highlight(
				snippet.value.code,
				grammar,
				lang,
			);
			if (codeEl.value) Prism.highlightElement(codeEl.value);
		}
	} catch (err: any) {
		error.value = err.message || "Erreur lors de la récupération du snippet";
	} finally {
		loading.value = false;
	}
}

function goBack() {
	router.push("/");
}
function editSnippet() {
	router.push({ name: "SnippetEdit", params: { id: snippetId } });
}
function confirmDelete() {
	showConfirm.value = true;
}
async function deleteSnippet() {
	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Utilisateur non authentifié");
		setAuthToken(token);
		await apiDeleteSnippet(snippetId, token);
		showConfirm.value = false;
		router.push("/");
	} catch (err: any) {
		alert(err.message || "Erreur lors de la suppression du snippet");
	}
}

watch(snippet, async () => {
	await nextTick();
	if (snippet.value) {
		const lang = snippet.value.language?.slug || "javascript";
		const grammar = Prism.languages[lang]!;
		highlightedCode.value = Prism.highlight(snippet.value.code, grammar, lang);
		if (codeEl.value) Prism.highlightElement(codeEl.value);
	}
});

onMounted(fetchSnippet);
</script>

<style scoped>
.snippet-detail-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 1rem 2rem;
  background: #1c3632;
  color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  position: relative;
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.snippet-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #24d650;
  word-break: break-word;
}

.header-buttons button {
  margin-left: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}

.edit-btn { color: #24d650; }
.edit-btn:hover { color: #1bb545; }

.delete-btn { color: #ff5c5c; }
.delete-btn:hover { color: #ff0000; }

.snippet-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.language-tag {
  background-color: #f39c12;
  color: #fff;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-size: 0.85rem;
}

.tags .tag {
  background-color: #3498db;
  color: #fff;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-size: 0.85rem;
  margin-right: 0.3rem;
}

.snippet-description {
  margin-bottom: 0.5rem;
}
.meta-label { font-weight: 600; }
.meta-value { color: #f5f5f5; }

.snippet-code {
  /* background: #0e403e; */
  display: flex;
  background: #2d2d2d;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: 'Fira Code', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.footer[data-v-73d1aba9] {
    display: flex;
    font-size: 0.85rem;
    color: #ccc;
    margin-bottom: 1rem;
    justify-content: space-between;
}

button {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.error {
  color: #e53e3e;
  font-weight: 600;
}

/* Popup de confirmation */
.confirm-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.confirm-box {
  background: #1c3632;
  color: #f5f5f5;
  padding: 1.2rem 1.5rem;
  border-radius: 10px;
  text-align: center;
  width: 90%;
  max-width: 300px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}

.confirm-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.confirm-yes {
  background-color: #24d650;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm-yes:hover { background-color: #1bb545; }

.confirm-no {
  background-color: #ff5c5c;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm-no:hover { background-color: #ff0000; }
</style>
