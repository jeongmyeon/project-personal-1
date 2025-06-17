import axios from "axios";

export default function createApi() {
    const API_BASE_URL = "http://localhost:8080";

    const api = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
    });

    api.interceptors.request.use(
        (config) => {
            if(config.data instanceof FormData){
                config.headers['Content-Type'] = 'multipart/form-data';
            }else if(config.data && typeof config.data === 'object'){
                config.headers['Content-Type'] = 'application/json';
            }

            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return api;
}
