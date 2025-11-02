import type { Language } from "../types/types";
import axios from "./axios";

const API_BASE_URL = "/api/languages";

export async function fetchAllLanguages(): Promise<Language[]> {
	try {
		const response = await axios.get<Language[]>(API_BASE_URL);
		return response.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.message ||
				"Erreur lors de la récupération des languages",
		);
	}
}

export async function fetchLanguageBySlug(slug: string): Promise<Language> {
	try {
		const response = await axios.get<Language>(
			`${API_BASE_URL}/${encodeURIComponent(slug)}`,
			{
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.status === 404
				? "Language non trouvé"
				: error.response?.data?.message ||
					error.message ||
					"Erreur lors de la récupération du language";
		throw new Error(message);
	}
}
