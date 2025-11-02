import type { AuthResponse, LoginInput, SignupInput } from "../types/types";
import axios from "./axios";

const API_BASE_URL = "/api/auth";

export async function signup(signupData: SignupInput): Promise<void> {
	try {
		const response = await axios.post<void>(
			`${API_BASE_URL}/signup`,
			signupData,
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.message ||
			error.message ||
			"Erreur lors de l'inscription";
		throw new Error(message);
	}
}

export async function login(loginData: LoginInput): Promise<AuthResponse> {
	try {
		const response = await axios.post<AuthResponse>(
			`${API_BASE_URL}/login`,
			loginData,
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.message ||
			error.message ||
			"Erreur lors de la connexion";
		throw new Error(message);
	}
}

export async function logout(): Promise<void> {
	try {
		const response = await axios.post<void>(`${API_BASE_URL}/logout`);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.message ||
			error.message ||
			"Erreur lors de la déconnexion";
		throw new Error(message);
	}
}
