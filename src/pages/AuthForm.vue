<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loginUser } from "../api/useAuth";
import { signup } from "../api/authApi";
import type { LoginInput, SignupInput } from "../types/types";

const route = useRoute();
const router = useRouter();

const mode = computed(() =>
  route.query.mode === "signup" ? "signup" : "login"
);

const loginForm = ref<LoginInput>({
  email: "",
  password: "",
});

const signupForm = ref<SignupInput>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
});

const localError = ref<string | null>(null);

async function handleLogin() {
  localError.value = null;
  try {
    await loginUser(loginForm.value);
    router.push("/"); 
  } catch (e: any) {
    localError.value = e.message || "Erreur lors de la connexion";
  }
}

async function handleSignup() {
  localError.value = null;
  try {
    await signup(signupForm.value);

    await loginUser({
      email: signupForm.value.email,
      password: signupForm.value.password,
    });

    router.push("/");
  } catch (e: any) {
    localError.value = e.message || "Erreur lors de l'inscription";
  }
}


</script>

<template>
  <h1>Welcome to Bibliotech</h1>
  <p>Your one-stop solution for managing code snippets.</p>

  <div class="auth-form">
    <div class="switch">
      <button
        :disabled="mode === 'login'"
        @click="router.replace({ query: { mode: 'login' } })"
      >
        Login
      </button>
      <button
        :disabled="mode === 'signup'"
        @click="router.replace({ query: { mode: 'signup' } })"
      >
        Signup
      </button>
    </div>

    <div v-if="localError" class="error">{{ localError }}</div>

    <div v-if="mode === 'login'">
      <form @submit.prevent="handleLogin">
        <input
          v-model="loginForm.email"
          type="email"
          required
          placeholder="Email"
        />
        <input
          v-model="loginForm.password"
          type="password"
          required
          placeholder="Password"
        />
        <button type="submit">Connexion</button>
      </form>
    </div>

    <div v-else>
      <form @submit.prevent="handleSignup">
        <input
          v-model="signupForm.first_name"
          type="text"
          required
          placeholder="Prénom"
        />
        <input
          v-model="signupForm.last_name"
          type="text"
          required
          placeholder="Nom"
        />
        <input
          v-model="signupForm.email"
          type="email"
          required
          placeholder="Email"
        />
        <input
          v-model="signupForm.password"
          type="password"
          required
          placeholder="Password"
        />
        <button type="submit">Créer le compte</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background: #fafcff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #ddd;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.switch {
  margin-bottom: 18px;
  text-align: center;
}

.switch button {
  margin-right: 10px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: #24d650;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.switch button:disabled {
  background-color: #a7e4b2;
  cursor: not-allowed;
}

.switch button:not(:disabled):hover {
  background-color: #1bb847;
}

.error {
  color: #e53e3e;
  margin-bottom: 18px;
  text-align: center;
  font-weight: 500;
}

h1 {
  color: #24d650;
  text-align: center;
  font-size: 4rem;
}

p {
  text-align: center;
  margin-bottom: 20px;
  color: #555;
}

input,
button[type="submit"] {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  /* border: 1px solid #ccc; */
  border: none;
  outline: none;
  box-sizing: border-box; /* ⚡ garantit même largeur */
}

button[type="submit"] {
  background-color: #24d650;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover {
  background-color: #1bb847;
}


button[type="submit"]:hover {
  background-color: #1bb847;
}
</style>
