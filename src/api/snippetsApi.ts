import type { Snippet } from "../types/types";
import axios from "./axios";

const API_BASE_URL = "/api/snippets";

export async function fetchAllSnippets(): Promise<Snippet[]> {
  try {
    const response = await axios.get<Snippet[]>(API_BASE_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur lors de la récupération des snippets");
  }
}

export async function fetchSnippetById(id: number): Promise<Snippet> {
  try {
    const response = await axios.get<Snippet>(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.status === 404 ?
      "Snippet non trouvé" :
      error.response?.data?.message || error.message || "Erreur lors de la récupération du snippet";
    throw new Error(message);
  }
}

export async function searchSnippets(query: string): Promise<Snippet[]> {
  try {
    const response = await axios.get<Snippet[]>(`${API_BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur lors de la recherche");
  }
}

export interface SnippetInput {
  title: string;
  description?: string | null;
  code: string;
  language_id: number | null;
  tagIds?: number[];
  status?: boolean;
}

export async function createSnippet(snippet: SnippetInput, token: string): Promise<Snippet> {
  try {
    const response = await axios.post<Snippet>(API_BASE_URL, snippet, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur lors de la création du snippet");
  }
}

export async function updateSnippet(id: number, snippet: SnippetInput, token: string): Promise<Snippet> {
  try {
    const response = await axios.patch<Snippet>(`${API_BASE_URL}/${id}`, snippet, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.status === 404 ?
      "Snippet non trouvé" :
      error.response?.data?.message || error.message || "Erreur lors de la mise à jour";
    throw new Error(message);
  }
}

export async function deleteSnippet(id: number, token: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    const message =
      error.response?.status === 404 ?
      "Snippet non trouvé" :
      error.response?.data?.message || error.message || "Erreur lors de la suppression";
    throw new Error(message);
  }
}
