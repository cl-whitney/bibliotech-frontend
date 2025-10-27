<template>
  <section>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>

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
import { ref, onMounted } from "vue";
import SnippetCard from "../components/SnippetCard.vue";
import type { Snippet } from "../types/types";

const snippets = ref<Snippet[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function fetchSnippets() {
  try {
    const response = await fetch("http://localhost:3000/api/snippets");
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const data: Snippet[] = await response.json();

    snippets.value = data.map(s => ({
      ...s,
      created_at: new Date(s.created_at),
      updated_at: s.updated_at ? new Date(s.updated_at) : undefined
    }));
  } catch (e: any) {
    error.value = e.message || "Erreur inconnue";
  } finally {
    loading.value = false;
  }
}


onMounted(fetchSnippets);
</script>

<style scoped>
.snippet-list {
  list-style: none;
  padding: 0;
  margin-top: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* exactement 3 colonnes égales */
  gap: 1rem;
}
@media (max-width: 900px) {
  .snippet-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
