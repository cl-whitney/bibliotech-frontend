<template>
  <div class="layout">
    <AppMain>
      <router-view />
    </AppMain>
  </div>
  <AppFooter />
</template>

<script setup>
import AppFooter from "../components/AppFooter.vue";
import AppMain from "../components/AppMain.vue";
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}
</style>
