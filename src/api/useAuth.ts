import { ref } from "vue";
import axios, { setAuthToken } from "../api/axios";
import type {
	AuthResponse,
	LoginInput,
	SessionUser,
	SignupInput,
	User,
} from "../types/types";

const currentUser = ref<SessionUser | null>(null);
const error = ref<string | null>(null);

// Export du token pour utilisation dans d'autres composants
export const token = ref<string | null>(null);

/**
 * Login
 */
export async function loginUser(credentials: LoginInput) {
	error.value = null;
	try {
		const response = await axios.post<AuthResponse>(
			"/api/auth/login",
			credentials,
			{ withCredentials: true },
		);

		// Récupération du token
		token.value = response.data.token?.accessToken?.token || null;
		if (!token.value)
			throw new Error("Token manquant dans la réponse du serveur");

		setAuthToken(token.value);

		// Récupération des infos utilisateur
		const userResponse = await axios.get<User>(
			`/api/users/${response.data.user.id}`,
			{ withCredentials: true },
		);
		const { password, ...safeUser } = userResponse.data;
		currentUser.value = safeUser as SessionUser;

		console.log("✅ Login success:", currentUser.value);
		return currentUser.value;
	} catch (err: any) {
		const message =
			err.response?.data?.message ||
			err.message ||
			"Erreur lors de la connexion";
		error.value = message;
		console.error("❌ Login error:", message);
		throw new Error(message);
	}
}

/**
 * Signup
 */
export async function signup(signupData: SignupInput) {
	error.value = null;
	try {
		const response = await axios.post("/api/auth/signup", signupData, {
			withCredentials: true,
		});
		console.log("✅ Signup success", response.data);
	} catch (err: any) {
		const message =
			err.response?.data?.message ||
			err.message ||
			"Erreur lors de l'inscription";
		error.value = message;
		console.error("❌ Signup error:", message);
		throw new Error(message);
	}
}

/**
 * Logout
 */
export async function logoutUser() {
	try {
		await axios.post("/api/auth/logout", {}, { withCredentials: true });
		console.log("✅ Logout success");
	} catch (err) {
		console.error("Logout error", err);
	} finally {
		token.value = null;
		setAuthToken(null);
		currentUser.value = null;
	}
}

// Export des états réactifs
export { currentUser, error };
