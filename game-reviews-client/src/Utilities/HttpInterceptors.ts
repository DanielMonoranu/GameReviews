import axios from "axios";
import { config } from "process";
import { getToken } from "../Auth/JWTHandler";

export default function configureInterceptor() {
    axios.interceptors.request.use(
        config => {
            if (config.url?.startsWith('https://api.twitch.tv/')) {
                //
                return config;
            }
            const token = getToken();
            if (token) {
                config.headers['Authorization'] = `bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error)
        }
    )
}