// This is to create an interceptor. Interceptor intercept any request and will automatically add the correct Headers.
// We'll use axios, to send network request
// It will check if we have access token

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/epia-epmp/epiaepmp/v1";

// Constants for localStorage keys (same as in LoginForm)
const RATE_LIMIT_KEY = "login_rate_limited";
const COOLDOWN_TIME_KEY = "login_cooldown_time";
const COOLDOWN_END_KEY = "login_cooldown_end_time";

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

      // Get remaining seconds from the response
      const remainingSeconds = error.response.data.remaining_seconds || 60;

      // Store rate limit info in localStorage
      localStorage.setItem(RATE_LIMIT_KEY, "true");
      localStorage.setItem(COOLDOWN_TIME_KEY, remainingSeconds.toString());
      localStorage.setItem(
        COOLDOWN_END_KEY,
        (Date.now() + remainingSeconds * 1000).toString()
      );

      // Add the remaining seconds to the error object for components to use
      error.remainingSeconds = remainingSeconds;

      console.warn("Rate limit reached:", error.response.data.detail);
    }

    return Promise.reject(error);
  }
);

export default api;
