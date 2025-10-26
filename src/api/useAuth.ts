import axios, { setAuthToken } from "../api/axios";
import { ref } from "vue";
import type { SessionUser, LoginInput, AuthResponse, User } from "../types/types";

const currentUser = ref<SessionUser | null>(null);
const error = ref<string | null>(null);
let token: string | null = null;

export async function loginUser(credentials: LoginInput) {
  error.value = null;
  try {
    const response = await axios.post<AuthResponse>("/auth/login", credentials);

    token = response.data.token;
    setAuthToken(token);

    const userResponse = await axios.get<User>(`/api/users/${response.data.userId}`);
    const { password, ...safeUser } = userResponse.data;
    currentUser.value = safeUser as SessionUser;

  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || "Erreur lors de la connexion";
    throw err;
  }
}

export async function logoutUser() {
  await axios.post("/auth/logout");
  token = null;
  setAuthToken(null);
  currentUser.value = null;
}
