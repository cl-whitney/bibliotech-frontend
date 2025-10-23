<template>
  <li class="snippet-card">
    <pre>Titre: {{ snippet.title }}</pre>
    <pre>Language: {{ snippet.language?.name ?? '-' }}</pre>
    <pre>Tags: <span v-if="snippet.tags && snippet.tags.length"><span v-for="tag in snippet.tags" :key="tag.id">{{ tag.name }} </span></span><span v-else>-</span>
    </pre>
    <pre>Code: {{ snippet.code }}</pre>
    <pre>Description: {{ snippet.description ?? '-' }}</pre>
    <pre>Créé le: {{ new Date(snippet.created_at).toLocaleString() }}</pre>
    <pre>Mis à jour le: {{ snippet.updated_at ? new Date(snippet.updated_at).toLocaleString() : '-' }}</pre>
  </li>
</template>

<script setup lang="ts">
import type { Snippet } from "../types";

defineProps<{ snippet: Snippet }>();
</script>

<style scoped>
.snippet-card {
  background: #6aa84f;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

pre {
  background: #18534f;
  color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0 0 0.5rem 0;
}
</style>
