<template>
  <AppHeader />
  <div class="layout">
    <MenuSideBar />
    <AppMain>
      <router-view />
    </AppMain>
  </div>
  <AppFooter />
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import MenuSideBar from '../components/MenuSideBar.vue'
import AppMain from '../components/AppMain.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}
</style>
