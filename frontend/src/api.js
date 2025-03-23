// This is to create an interceptor. Interceptor intercept any request and will automatically add the correct Headers.
// We'll use axios, to send network request
// It will check if we have access token

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/epia-epmp/epiaepmp/v1";

// Create a custom event for rate limiting
export const rateLimitEvent = new Event("rateLimitDetected");

//
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle rate limiting (429 errors)
    if (error.response && error.response.status === 429) {
      // Dispatch custom event that components can listen for
      window.dispatchEvent(rateLimitEvent);

      // Extract the retry-after header if present
      const retryAfter = error.response.headers["retry-after"];
      if (retryAfter) {
        error.retryAfter = parseInt(retryAfter, 10);
      }

      // You can set up global notification here if needed
      console.warn("Rate limit reached:", error.response.data.detail);
    }

    return Promise.reject(error);
  }
);

export default api;
