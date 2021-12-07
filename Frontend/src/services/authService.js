import http from "./httpService";
import jwtDecode from "jwt-decode";
import { apiEndpoint } from "../configurations/apiConfig.json";

const loginEndpoint = apiEndpoint + "/login";
const authToken = "auth-token";

export async function login(user) {
  const { data: jwt } = await http.post(loginEndpoint, user);
  localStorage.setItem(authToken, jwt);
}

export async function loginWithJwt(jwt) {
  localStorage.setItem(authToken, jwt);
}

export function logout() {
  localStorage.removeItem(authToken);
}

export function getJwtAuthToken() {
  return localStorage.getItem(authToken);
}

http.setJwtAuthToken(getJwtAuthToken());

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(authToken);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}
