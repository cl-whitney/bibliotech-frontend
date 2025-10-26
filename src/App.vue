<script setup lang="ts">
// import SnippetsList from './pages/SnippetsList.vue'
// import MenuSideBar from './components/MenuSideBar.vue'
// import SearchBar from './components/SearchBar.vue'
</script>

<template>
  <!-- <div id="app" class="app-container">
    <div  class="search-bar">
  <SearchBar/>
    </div>
<div class="main-container"  >
  <MenuSideBar />
  <SnippetsList />
  </div>
</div> -->

<router-view />

</template>

<!-- Style CSS -->
<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
}
.search-bar {
  width: 100%;
  padding: 1rem;
  background: #333;
}
.main-container {
  display: flex;
}

</style>
