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
        <button class="btn edit" @click="toggleEditMode">
          ✏️ {{ editMode ? 'Annuler' : 'Modifier mes infos' }}
        </button>

        <button class="btn password" @click="togglePasswordMode">
          🔑 Modifier mon mot de passe
        </button>

        <button class="btn logout" @click="logout">🚪 Déconnexion</button>
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
            💾 {{ updating ? 'Mise à jour...' : 'Enregistrer' }}
          </button>
        </form>
      </div>

      <div v-if="passwordMode" class="password-form">
        <form @submit.prevent="handlePasswordChange">
          <label>
            Ancien mot de passe :
            <input type="password" v-model="passwordForm.oldPassword" required />
          </label>

          <label>
            Nouveau mot de passe :
            <input type="password" v-model="passwordForm.newPassword" required />
          </label>

          <button type="submit" class="btn save-btn" :disabled="updating">
            🔒 {{ updating ? 'Modification...' : 'Changer le mot de passe' }}
          </button>
        </form>
      </div>

      <div class="danger-zone">
        <h3>Zone dangereuse</h3>
        <p>Supprimer votre compte est une action <strong>irréversible</strong>.</p>
        <button class="btn delete" @click="confirmDelete = true">🗑️ Supprimer mon compte</button>
      </div>
    </div>

    <!-- Modale de confirmation -->
    <div v-if="confirmDelete" class="modal-overlay">
      <div class="modal">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive.</p>
        <div class="modal-actions">
          <button class="btn cancel" @click="confirmDelete = false">Annuler</button>
          <button class="btn delete" @click="deleteAccount">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { currentUser, logoutUser, token } from "../api/useAuth";
import {
	deleteUser,
	fetchUserById,
	updatePassword,
	updateUser,
} from "../api/userApi";
import type { User } from "../types/types";

const user = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const editMode = ref(false);
const passwordMode = ref(false);
const updating = ref(false);
const confirmDelete = ref(false);

const form = ref({
	first_name: "",
	last_name: "",
	email: "",
});

const passwordForm = ref({
	oldPassword: "",
	newPassword: "",
});

function toggleEditMode() {
	editMode.value = !editMode.value;
	passwordMode.value = false;
	if (editMode.value && user.value) {
		form.value.first_name = user.value.first_name;
		form.value.last_name = user.value.last_name;
		form.value.email = user.value.email;
	}
}

function togglePasswordMode() {
	passwordMode.value = !passwordMode.value;
	editMode.value = false;
}

async function loadUser() {
	loading.value = true;
	try {
		if (!currentUser.value?.id) throw new Error("Utilisateur non connecté");
		if (!token) throw new Error("Accès non autorisé. Token manquant.");

		const data = await fetchUserById(currentUser.value.id, token);
		user.value = data;
	} catch (err: any) {
		error.value = err.message || "Erreur lors du chargement du compte";
	} finally {
		loading.value = false;
	}
}

async function handleUpdate() {
	if (!user.value || !token.value) return;
	updating.value = true;
	try {
		const updated = await updateUser(user.value.id, form.value, token.value);
		user.value = updated;
		editMode.value = false;
	} catch (err: any) {
		alert(err.message || "Erreur lors de la mise à jour du profil");
	} finally {
		updating.value = false;
	}
}

async function handlePasswordChange() {
	if (!token.value) return;
	updating.value = true;
	try {
		await updatePassword(passwordForm.value, token.value);
		alert("Mot de passe modifié avec succès !");
		passwordMode.value = false;
		passwordForm.value = { oldPassword: "", newPassword: "" };
	} catch (err: any) {
		alert(err.message || "Erreur lors du changement de mot de passe");
	} finally {
		updating.value = false;
	}
}

async function deleteAccount() {
	if (!user.value || !token.value) return;
	try {
		await deleteUser(user.value.id, token.value);
		await logoutUser();
		alert("Compte supprimé avec succès.");
		window.location.href = "/login";
	} catch (err: any) {
		alert(err.message || "Erreur lors de la suppression du compte");
	}
}

async function logout() {
	await logoutUser();
	window.location.href = "/login";
}

onMounted(loadUser);
</script>

<style scoped>
.account-container {
  max-width: 700px;
  margin: 3rem auto;
  background: #132a27;
  color: #f5f5f5;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}
.account-title {
  text-align: center;
  font-size: 1.9rem;
  color: #24d650;
  margin-bottom: 2rem;
}
.account-info {
  border: 1px solid #2a5a4e;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  background: #1c3632;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #2a5a4e;
}
.info-row:last-child {
  border-bottom: none;
}
.label {
  color: #a7e4b2;
  font-weight: 600;
}
.account-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.btn {
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  color: white;
  transition: transform 0.15s, background 0.25s;
}
.btn:hover {
  transform: scale(1.05);
}
.btn.edit {
  background: #24d650;
}
.btn.password {
  background: #0aa0d6;
}
.btn.logout {
  background: #d62424;
}
.btn.save-btn {
  background: #24d650;
  align-self: flex-end;
}
.btn.delete {
  background: #b71c1c;
}
.danger-zone {
  margin-top: 2rem;
  background: #291717;
  border: 1px solid #b71c1c;
  padding: 1.2rem;
  border-radius: 10px;
  text-align: center;
}
.danger-zone h3 {
  color: #ff5c5c;
  margin-bottom: 0.5rem;
}
.password-form,
.account-edit {
  margin-top: 1.5rem;
  background: #1c3632;
  padding: 1rem 1.5rem;
  border-radius: 8px;
}
.password-form form,
.account-edit form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  background: #0e403e;
  color: white;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #1c3632;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  width: 90%;
  max-width: 400px;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn.cancel {
  background: #0aa0d6;
}
</style>
