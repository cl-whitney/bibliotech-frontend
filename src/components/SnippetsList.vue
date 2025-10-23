<template>
  <section>
    <h2>Liste des Snippets</h2>

    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>
    
    <ul v-else>
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
import SnippetCard from "./SnippetCard.vue";
import type { Snippet } from "../types";

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
ul {
  list-style: none;
  padding: 0;
}
</style>
