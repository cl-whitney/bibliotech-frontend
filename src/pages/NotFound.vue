<template>
  <section class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Oups ! La page que vous recherchez n’existe pas.</p>

      <button @click="goHome" class="back-btn">Retour à l’accueil</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goHome() {
	router.push({ name: "Home" });
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  background: #0f2926;
  color: #f5f5f5;
  text-align: center;
  flex-direction: column;
}

.content {
  max-width: 600px;
  padding: 2rem;
  border-radius: 12px;
  background: #1c3632;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 6rem;
  font-weight: 800;
  color: #24d650;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.back-btn {
  background-color: #24d650;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background-color: #1bb847;
}
</style>
