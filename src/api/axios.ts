import axios from "axios";

const instance = axios.create({
	baseURL: "https://bibliotech-backend-8dhq.onrender.com",
	withCredentials: true,
});

export function setAuthToken(token: string | null) {
	if (token) {
		instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		localStorage.setItem("token", token);
	} else {
		delete instance.defaults.headers.common["Authorization"];
		localStorage.removeItem("token");
	}
}

const savedToken = localStorage.getItem("token");
if (savedToken) {
	setAuthToken(savedToken);
}

export default instance;
