<template>
  <section class="snippet-detail-container">
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="snippet">
      <h2>{{ snippet.title }}</h2>

      <div class="meta">
        <div><strong>Language:</strong> {{ snippet.language?.name ?? '-' }}</div>
        <div>
          <span v-if="snippet.tags && snippet.tags.length">
            <span v-for="tag in snippet.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
          </span>
          <span v-else>-</span>
        </div>
        <div><strong>Description:</strong> {{ snippet.description ?? '-' }}</div>
      </div>

      <div class="code-block">
        <pre>{{ snippet.code }}</pre>
      </div>

      <div class="footer">
        Créé: {{ new Date(snippet.created_at).toLocaleString() }} |
        Mis à jour: {{ snippet.updated_at ? new Date(snippet.updated_at).toLocaleString() : '-' }}
      </div>

      <button @click="goBack">← Retour</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchSnippetById } from "../api/snippetsApi";
import { token } from "../api/useAuth";
import type { Snippet } from "../types/types";

const route = useRoute();
const router = useRouter();
const snippet = ref<Snippet | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const snippetId = Number(route.params.id);

async function fetchSnippet() {
  loading.value = true;
  error.value = null;

  try {
    if (!token.value) throw new Error("Accès non autorisé. Token manquant.");
    snippet.value = await fetchSnippetById(snippetId, token.value);
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la récupération du snippet";
    console.error("fetch snippet error:", error.value);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push("/"); // retourne à la liste des snippets
}

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
}

.meta div {
  margin-bottom: 0.5rem;
}

.tag {
  background-color: #24d650;
  color: #fff;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  margin-right: 0.3rem;
  font-size: 0.85rem;
}

.code-block {
  background: #0e403e;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: 'Fira Code', monospace;
}

.footer {
  font-size: 0.85rem;
  color: #ccc;
  margin-bottom: 1rem;
}

button {
  background-color: #24d650;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #1bb847;
}
.error {
  color: #e53e3e;
  font-weight: 600;
}
</style>
