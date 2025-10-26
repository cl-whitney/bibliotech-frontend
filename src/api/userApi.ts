import type { User } from "../types/types";
import axios from "./axios";

const API_BASE_URL = "/api/users";

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const response = await axios.get<User[]>(API_BASE_URL);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Erreur lors de la récupération des utilisateurs";
    throw new Error(message);
  }
}

export async function fetchUserById(id: number): Promise<User> {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.status === 404 ?
      "Utilisateur non trouvé" :
      error.response?.data?.message || error.message || "Erreur lors de la récupération de l'utilisateur";
    throw new Error(message);
  }
}

export interface UserUpdateInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  status?: boolean;
}

export async function updateUser(id: number, userData: UserUpdateInput, token: string): Promise<User> {
  try {
    const response = await axios.patch<User>(`${API_BASE_URL}/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.status === 404 ?
      "Utilisateur non trouvé" :
      error.response?.data?.message || error.message || "Erreur lors de la mise à jour";
    throw new Error(message);
  }
}

export async function deleteUser(id: number, token: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    const message =
      error.response?.status === 404 ?
      "Utilisateur non trouvé" :
      error.response?.data?.message || error.message || "Erreur lors de la suppression";
    throw new Error(message);
  }
}
