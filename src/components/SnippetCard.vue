<template>
  <li class="snippet-card">
    <!-- Etoile Favoris -->
    <button class="favorite-btn" @click.stop="toggleFavorite">
      <span v-if="isFavorite">★</span>
      <span v-else>☆</span>
    </button>

    <div class="snippet-title" @click="goToDetail">{{ props.snippet.title }}</div>

    <div class="snippet-meta">
      <span v-if="props.snippet.language" class="language-tag">{{ props.snippet.language.name }}</span>
      <span class="tags">
        <span v-if="props.snippet.tags && props.snippet.tags.length">
          <span v-for="tag in props.snippet.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
        </span>
      </span>
    </div>

    <div class="snippet-description">
      <span class="meta-label">Description: </span>
      <span class="meta-value">{{ props.snippet.description ?? '-' }}</span>
    </div>

    <div class="snippet-code">
      <!-- Bouton copier style ChatGPT -->
      <button class="copy-btn" @click="copyCode">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M16 1H4C2.895 1 2 1.895 2 3v14h2V3h12V1zm3 4H8c-1.105 0-2 .895-2 2v16c0 1.105.895 2 2 2h11c1.105 0 2-.895 2-2V7c0-1.105-.895-2-2-2zm0 18H8V7h11v16z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </button>

      <pre :class="`language-${props.snippet.language?.slug || 'javascript'}`">
        <code ref="codeEl">{{ displayedCode }}</code>
      </pre>

      <button v-if="needsTruncate" class="toggle-btn" @click="toggleCode">
        {{ showFullCode ? "Voir moins" : "Voir plus" }}
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { Snippet } from "../types/types";
import Prism from "../utils/prism-languages";

const props = defineProps<{ snippet: Snippet }>();
const router = useRouter();

const isFavorite = ref(false);
const showFullCode = ref(false);
const codeEl = ref<HTMLElement | null>(null);
const copied = ref(false);
const MAX_LINES = 5;

function goToDetail() {
	router.push({ name: "SnippetDetail", params: { id: props.snippet.id } });
}

function toggleFavorite() {
	const favorites: number[] = JSON.parse(
		localStorage.getItem("favorites") || "[]",
	);
	if (isFavorite.value) {
		const index = favorites.indexOf(props.snippet.id);
		if (index > -1) favorites.splice(index, 1);
		isFavorite.value = false;
	} else {
		favorites.push(props.snippet.id);
		isFavorite.value = true;
	}
	localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleCode() {
	showFullCode.value = !showFullCode.value;
}

function copyCode() {
	if (!codeEl.value) return;
	navigator.clipboard.writeText(props.snippet.code).then(() => {
		copied.value = true;
		setTimeout(() => (copied.value = false), 1500);
	});
}

const codeLines = computed(() => props.snippet.code.split("\n"));
const needsTruncate = computed(() => codeLines.value.length > MAX_LINES);
const displayedCode = computed(() => {
	if (showFullCode.value || !needsTruncate.value) return props.snippet.code;
	return codeLines.value.slice(0, MAX_LINES).join("\n") + "\n...";
});

watch([displayedCode, () => props.snippet.language?.slug], async () => {
	await nextTick();
	if (codeEl.value) Prism.highlightElement(codeEl.value);
});

onMounted(() => {
	const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
	isFavorite.value = favorites.includes(props.snippet.id);

	nextTick(() => {
		if (codeEl.value) Prism.highlightElement(codeEl.value);
	});
});
</script>

<style scoped>
.snippet-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #1c3632;
  color: #f5f5f5;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  position: relative;
  gap: 1rem;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #ffce00;
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.favorite-btn:hover { transform: scale(1.2); }

.snippet-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #24d650;
  cursor: pointer;
}

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
  margin-right: 0.3rem;
  font-size: 0.85rem;
}

.snippet-description {
  margin-bottom: 0.5rem;
}

.snippet-code {
  position: relative;
  background: #0e403e;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 0.5rem;
}

/* Bouton copier style ChatGPT */
.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #24d650;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.copy-btn:hover {
  background: rgba(36, 214, 80, 0.2);
  transform: scale(1.1);
}

/* Toggle bouton */
.toggle-btn {
  background: transparent;
  color: #24d650;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-top: 0.3rem;
  text-align: left;
}
</style>
