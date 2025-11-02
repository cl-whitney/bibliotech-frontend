import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:3000",
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

// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:3000",
//   withCredentials: true,
// });

// export function setAuthToken(token: string | null) {
//   if (token) {
//     instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete instance.defaults.headers.common["Authorization"];
//   }
// }

// export default instance;
