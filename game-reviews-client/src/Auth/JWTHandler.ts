import { authenticationResponseDTO, claim } from "./auth.models";


const tokenKey = 'token';
const expirationKey = 'token-expiration';


export function saveToken(authenticationData: authenticationResponseDTO) {
    localStorage.setItem(tokenKey, authenticationData.token);
    localStorage.setItem(expirationKey, authenticationData.expirationDate.toString());
}

export function getClaims(): claim[] {
    const response: claim[] = [];

    const token = localStorage.getItem(tokenKey);
    if (!token) return [];
    const expirationDate = new Date(localStorage.getItem(expirationKey)!);
    if (expirationDate <= new Date()) {
        logout();
        return [];//the token has expired
    }

    const dataToken = JSON.parse(atob(token.split('.')[1])); //atob() decodes a base-64 encoded string.
    for (const item in dataToken) {
        response.push({ name: item, value: dataToken[item] });
    }
    return response;
}
export function logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(expirationKey);
}

export function getToken() {
    return localStorage.getItem(tokenKey);
}
