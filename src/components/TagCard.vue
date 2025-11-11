<template>
  <li class="tag-card">
    <div class="tag-header">
      <span class="tag-name">{{ tag.name }}</span>
      <button class="delete-btn" @click.stop="confirmDelete">
        ✕
      </button>
    </div>

    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>Voulez-vous vraiment supprimer le tag "<strong>{{ tag.name }}</strong>" ?</p>
        <div class="confirm-buttons">
          <button @click="deleteTag" class="confirm-yes">Oui</button>
          <button @click="showConfirm = false" class="confirm-no">Non</button>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { setAuthToken } from "../api/axios";
import { deleteTag as apiDeleteTag } from "../api/tagsApi";
import type { Tag } from "../types/types";

const props = defineProps<{ tag: Tag }>();
const emit = defineEmits<(e: "deleted", tagId: number) => void>();

const tag = props.tag;
const showConfirm = ref(false);

function confirmDelete() {
	showConfirm.value = true;
}

async function deleteTag() {
	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Utilisateur non authentifié");

		setAuthToken(token);
		await apiDeleteTag(tag.id, token);
		showConfirm.value = false;
		emit("deleted", tag.id);
	} catch (err: any) {
		alert(err.message || "Erreur lors de la suppression du tag");
	}
}
</script>

<style scoped>
.tag-card {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #1c3632;
  color: #f5f5f5;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  position: relative;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #24d650;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ff5c5c;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff0000;
}

.confirm-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.confirm-box {
  background: #1c3632;
  color: #f5f5f5;
  padding: 1.2rem 1.5rem;
  border-radius: 10px;
  text-align: center;
  width: 90%;
  max-width: 300px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}

.confirm-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.confirm-yes {
  background-color: #24d650;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-yes:hover { background-color: #1bb545; }

.confirm-no {
  background-color: #ff5c5c;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-no:hover { background-color: #ff0000; }
</style>
