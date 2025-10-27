<template>
  <div class="account-container">
    <h1 class="account-title">Mon compte</h1>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="account-card" v-if="user">
      <div class="account-info">
        <div class="info-row">
          <span class="label">Nom :</span>
          <span class="value">{{ user.first_name ?? '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Prénom :</span>
          <span class="value">{{ user.last_name ?? '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Email :</span>
          <span class="value">{{ user.email ?? '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Rôle :</span>
          <span class="value">{{ user.role ?? '-' }}</span>
        </div>
      </div>

      <div class="account-actions">
        <button class="btn" @click="toggleEditMode">
          {{ editMode ? 'Annuler' : 'Modifier mes infos' }}
        </button>
        <button class="btn logout" @click="logout">Se déconnecter</button>
      </div>

      <div v-if="editMode" class="account-edit">
        <form @submit.prevent="handleUpdate">
          <label>
            Nom :
            <input v-model="form.first_name" type="text" />
          </label>

          <label>
            Prénom :
            <input v-model="form.last_name" type="text" />
          </label>

          <label>
            Email :
            <input v-model="form.email" type="email" />
          </label>

          <button type="submit" class="btn save-btn" :disabled="updating">
            {{ updating ? 'Mise à jour...' : 'Enregistrer' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { User } from "../types/types"
import { fetchUserById, updateUser } from "../api/userApi"
import { currentUser, token, logoutUser } from "../api/useAuth"

const user = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const editMode = ref(false)
const updating = ref(false)

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
})

function toggleEditMode() {
  editMode.value = !editMode.value
  if (editMode.value && user.value) {
    form.value.first_name = user.value.first_name
    form.value.last_name = user.value.last_name
    form.value.email = user.value.email
  }
}

async function loadUser() {
  loading.value = true
  error.value = null
  try {
    if (!currentUser.value?.id) throw new Error("Utilisateur non connecté")
    if (!token) throw new Error("Accès non autorisé. Token manquant.")

    const data = await fetchUserById(currentUser.value.id, token)
    user.value = data
  } catch (err: any) {
    error.value = err.message || "Erreur lors du chargement du compte"
  } finally {
    loading.value = false
  }
}

async function handleUpdate() {
  if (!user.value || !token.value) return
  updating.value = true
  try {
    const tok = token.value
    if (!tok) {
      throw new Error("Accès non autorisé. Token manquant.")
    }
    const updated = await updateUser(user.value.id, form.value, tok)
    user.value = updated
    editMode.value = false
  } catch (err: any) {
    alert(err.message || "Erreur lors de la mise à jour du profil")
  } finally {
    updating.value = false
  }
}

async function logout() {
  await logoutUser()
  window.location.href = "/login" 
}

onMounted(loadUser)
</script>

<style scoped>
.account-container {
  max-width: 600px;
  margin: 2rem auto;
  background: #1c3632;
  color: #f5f5f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.account-title {
  text-align: center;
  font-size: 1.8rem;
  color: #24d650;
  margin-bottom: 1.5rem;
}
.loading, .error {
  text-align: center;
  font-size: 1.1rem;
}
.account-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.account-info .info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #2a5a4e;
}
.label {
  font-weight: 600;
  color: #a7e4b2;
}
.value {
  font-weight: 400;
}
.account-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn {
  background: #24d650;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #1eb24a;
}
.btn.logout {
  background: #d62424;
}
.btn.logout:hover {
  background: #b41f1f;
}
.account-edit form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.account-edit input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  background: #0e403e;
  color: #fff;
}
.save-btn {
  align-self: flex-end;
}
</style>
