<template>
  <div class="snippet-card-container">
  <li class="snippet-card">
    <div class="snippet-title">
      <pre>Titre: {{ snippet.title }}</pre>
    </div>
    <div class="snippet-header">
      <pre>Language: {{ snippet.language?.name ?? '-' }}</pre>
      <pre>Tags: <span v-if="snippet.tags && snippet.tags.length"><span v-for="tag in snippet.tags" :key="tag.id">{{ tag.name }} </span></span><span v-else>-</span></pre>
      <pre>Description: {{ snippet.description ?? '-' }}</pre>
    </div>
    <div class="snippet-code">
      <pre id="snippet-code">Code: {{ snippet.code }}</pre>
    </div>
    <div class="snippet-footer">
      <pre>Créé le: {{ new Date(snippet.created_at).toLocaleString() }}</pre>
      <pre>Mis à jour le: {{ snippet.updated_at ? new Date(snippet.updated_at).toLocaleString() : '-' }}</pre>
    </div>
  </li>
  </div>
</template>

<script setup lang="ts">
import type { Snippet } from "../types";

defineProps<{ snippet: Snippet }>();
</script>

<style scoped>
.snippet-card-container {
  width: 100%;
  display: block;
}

.snippet-card {
  background: #18534f;
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.snippet-title {
  width: 100%;

  margin-bottom: 0.5rem;
}

.snippet-title pre {
  /* background: linear-gradient(90deg, #0b7a72, #18534f); */
  background: none;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.6rem;
  margin: 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.snippet-header, .snippet-footer {
  width: 100%;
  margin-bottom: 0.5rem;
  /* background: #6aa84fa1; */
  border-radius: 8px;
  margin-bottom: 0.5rem;

}
.snippet-code {
  background: #141a19ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

#snippet-code {
  background: none;
}

.snippet-code pre {
  background: #0e403e;
}

pre {
  color: #fff;
  background: #6aa84fa1;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0 0 0.5rem 0;
}

</style>
