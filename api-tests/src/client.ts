import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./env.js";

export function createClient(config?: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    baseURL: getApiBaseUrl(),
    headers: { "Content-Type": "application/json" },
    ...config,
  });
}

export const client = createClient();
