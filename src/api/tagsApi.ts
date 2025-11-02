import type { Tag } from "../types/types";
import axios from "./axios";

const API_BASE_URL = "/api/tags";

export async function fetchAllTags(): Promise<Tag[]> {
	try {
		const response = await axios.get<Tag[]>(API_BASE_URL);
		return response.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.message ||
				"Erreur lors de la récupération des tags",
		);
	}
}

export async function fetchTagById(id: number): Promise<Tag> {
	try {
		const response = await axios.get<Tag>(`${API_BASE_URL}/${id}`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.status === 404
				? "Tag non trouvé"
				: error.response?.data?.message ||
					error.message ||
					"Erreur lors de la récupération du tag";
		throw new Error(message);
	}
}

export interface TagInput {
	name: string;
	status?: boolean;
}

export async function createTag(tag: TagInput, token: string): Promise<Tag> {
	try {
		const response = await axios.post<Tag>(API_BASE_URL, tag, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.message ||
				"Erreur lors de la création du tag",
		);
	}
}

export async function updateTag(
	id: number,
	tag: TagInput,
	token: string,
): Promise<Tag> {
	try {
		const response = await axios.patch<Tag>(`${API_BASE_URL}/${id}`, tag, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.status === 404
				? "Tag non trouvé"
				: error.response?.data?.message ||
					error.message ||
					"Erreur lors de la mise à jour";
		throw new Error(message);
	}
}

export async function deleteTag(id: number, token: string): Promise<void> {
	try {
		await axios.delete(`${API_BASE_URL}/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch (error: any) {
		const message =
			error.response?.status === 404
				? "Tag non trouvé"
				: error.response?.data?.message ||
					error.message ||
					"Erreur lors de la suppression";
		throw new Error(message);
	}
}
