import axios from "axios";
import { useRouter } from "next/router";
import toaster from "./toaster";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add request interceptor to add authorization header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add error interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => successHandler(response.data),
    (error) => errorHandler(error.response)
);

const errorHandler = async (error) => {
    if (error.status == 401 || error.status == 403) {
        const router = useRouter();
        toaster("error", error.data.message);
        router.push("/");
        return error.data;
    } else {
        toaster("error", error.data.message);
        return error.data;
    }
}

const successHandler = (response) => {
    if (response.show_message == true) {
        toaster("success", response.message);
    }
    return response;
}

export const postRequest = async (url_path, dataset) => {
    try {
        const response = await apiClient.post(url_path, { ...dataset });
        return response;
    } catch (error) {
        return error;
    }
}

export const getRequest = async (url_path, dataset) => {

}