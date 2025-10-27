<template>
  <div class="search-snippets">
    <div class="search-wrapper">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
      </svg>

      <input
        v-model="query"
        @input="onInput"
        @keydown.enter.prevent="selectFirst"
        type="search"
        :placeholder="placeholder"
        class="search-input"
        aria-label="Rechercher un snippet par nom"
      />
    </div>

    <ul v-if="debouncedQuery && results.length" class="results" role="listbox">
  <li
    v-for="snippet in results"
    :key="snippet.id ?? snippet.name"
    class="result-item"
    @click="select(snippet)"
    tabindex="0"
    role="option"
  >
    <div class="name" v-html="highlight(snippet.name)"></div>
    <div class="desc" v-if="snippet.description">{{ snippet.description }}</div>
  </li>
</ul>

    <p v-else-if="debouncedQuery" class="no-results">Aucun résultat</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: 'Rechercher un snippet...' },
  debounceMs: { type: Number, default: 200 }
})
const emit = defineEmits(['select'])

const query = ref('')
const debouncedQuery = ref('')
const results = ref([])

let timer = null
function onInput() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    debouncedQuery.value = query.value.trim()
  }, props.debounceMs)
}

watch(debouncedQuery, async (q) => {
  if (!q) {
    results.value = []
    return
  }
  try {
    const res = await fetch(`http://localhost:3000/api/snippets/search?q=${encodeURIComponent(q)}`)
    if (!res.ok) throw new Error('Erreur API')
    results.value = await res.json()
  } catch (err) {
    console.error(err)
    results.value = []
  }
})

function select(snippet) {
  emit('select', snippet)
  query.value = snippet.name || ''
  debouncedQuery.value = snippet.name || ''
}

function selectFirst() {
  if (results.value.length) select(results.value[0])
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeRegExp(s = '') {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(text = '') {
  const q = debouncedQuery.value
  if (!q) return escapeHtml(text)
  const pattern = new RegExp(`(${escapeRegExp(q)})`, 'ig')
  return escapeHtml(text).replace(pattern, '<mark>$1</mark>')
}
</script>


<style scoped>
.search-snippets {
  width: 100%;
  max-width: 100%;
  margin: 0.5rem 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: #bdbcbc1e; /* couleur de fond légère */
  border-radius: 9999px; /* pill shape */
  padding: 0.5rem 1rem;
  margin: auto 2.5rem;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
  color: #9ca3af; /* gris doux */
  margin-right: 0.5rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent; /* plus de bordure ni de fond */
  font-size: 1rem;
}

.search-input::placeholder {
  color: #9ca3af;
}

.results {
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  max-height: 240px;
  overflow: auto;
  background: #fff;
  padding: 0.5rem 1rem;
  margin: auto 2.5rem;
  margin-top: 0.5rem;
    margin-top: 0.5rem;
}

.result-item {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}
.result-item:last-child { border-bottom: none; }

.result-item:hover,
.result-item:focus {
  background: #f8fafc;
}

.name { font-weight: 600; }
.desc { font-size: 0.9rem; color: #475569; margin-top: 0.15rem; }

mark {
  background: #fde68a;
  padding: 0 2px;
  border-radius: 2px;
}

.no-results {
  margin-top: 0.5rem;
  color: #64748b;
}
</style>
