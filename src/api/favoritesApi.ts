import axios from "./axios";

export async function addFavorite(snippetId: number, token: string) {
	try {
		await axios.post(
			`/api/favorites/${snippetId}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
	} catch (err: any) {
		throw new Error(
			err.response?.data?.message || err.message || "Erreur ajout favori",
		);
	}
}

export async function removeFavorite(snippetId: number, token: string) {
	try {
		await axios.delete(`/api/favorites/${snippetId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch (err: any) {
		throw new Error(
			err.response?.data?.message || err.message || "Erreur suppression favori",
		);
	}
}
