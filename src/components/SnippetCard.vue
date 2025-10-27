<template>
  <li class="snippet-card" @click="goToDetail">
  <div class="snippet-title">{{ props.snippet.title }}</div>

  <div class="snippet-meta">
    <div>
      <span class="meta-label">Language: </span>
      <span class="meta-value">{{ props.snippet.language?.name ?? '-' }}</span>
    </div>

    <span class="meta-value tags">
      <span v-if="props.snippet.tags && props.snippet.tags.length">
        <span v-for="tag in props.snippet.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
      </span>
      <span v-else>-</span>
    </span>
  </div>

  <div class="snippet-description">
    <span class="meta-label">Description: </span>
    <span class="meta-value">{{ props.snippet.description ?? '-' }}</span>
  </div>

  <div class="snippet-code">
    <pre>{{ props.snippet.code }}</pre>
  </div>

  <div class="snippet-footer">
    <span>Créé: {{ new Date(props.snippet.created_at).toLocaleString() }}</span>
    <span> | Mis à jour: {{ props.snippet.updated_at ? new Date(props.snippet.updated_at).toLocaleString() : '-' }}</span>
  </div>
</li>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Snippet } from "../types/types";

// Récupère la prop
const props = defineProps<{ snippet: Snippet }>();

const router = useRouter();

function goToDetail() {
  router.push({ name: "SnippetDetail", params: { id: props.snippet.id } });
}

</script>


<style scoped>
.snippet-card {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #1c3632;
  color: #f5f5f5;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.snippet-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
}

.snippet-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #24d650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.snippet-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}

.meta-label {
  font-weight: 600;
  color: #a7e4b2;
}

.meta-value {
  font-weight: 400;
}

.tags .tag {
  background-color: #24d650;
  color: #fff;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  margin-right: 0.3rem;
  font-size: 0.85rem;
}

.snippet-description {
  margin-bottom: 0.5rem;
}

.snippet-code {
  background: #0e403e;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 0.5rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
}

.snippet-footer {
  font-size: 0.85rem;
  color: #ccc;
  display: flex;
  justify-content: space-between;
}
</style>
