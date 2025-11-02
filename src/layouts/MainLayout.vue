<template>
  <AppHeader />
  <div class="layout">
    <MenuSideBar class="sidebar" />
    <AppMain class="main">
      <router-view />
    </AppMain>
  </div>
  <AppFooter />
</template>

<script setup>
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import AppMain from "../components/AppMain.vue";
import MenuSideBar from "../components/MenuSideBar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden; 
}

/* Sidebar fixe sur grand écran */
.sidebar {
  flex: 0 0 250px;
}

/* Main prend tout l'espace restant */
.main {
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
}

/* Responsive pour petits écrans */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }
  
  .sidebar {
    flex: 0 0 auto;
    width: 100%;
    order: 1;
  }

  .main {
    order: 2;
    width: 100%;
  }
}
</style>
