import React, { useState } from "react";
import api from "../api";

// Constants for localStorage keys
const RATE_LIMIT_KEY = "login_rate_limited";
const COOLDOWN_TIME_KEY = "login_cooldown_time";
const COOLDOWN_END_KEY = "login_cooldown_end_time";

function DevTools({ setIsRateLimited, setCooldownTime }) {
  const [devStatus, setDevStatus] = useState("");

  // Reset frontend rate limiting
  const resetRateLimiting = () => {
    // Clear rate limiting flags in localStorage
    localStorage.removeItem(RATE_LIMIT_KEY);
    localStorage.removeItem(COOLDOWN_TIME_KEY);
    localStorage.removeItem(COOLDOWN_END_KEY);
    setIsRateLimited(false);
    setCooldownTime(0);
    setDevStatus("Frontend rate limiting reset");
  };

  // Check server status
  const checkServerStatus = async () => {
    try {
      const response = await api.get("/api/status");
      setDevStatus(`Server status: ${response.data.status}`);
    } catch (error) {
      if (error.response?.data?.remaining_seconds) {
        const remainingSeconds = error.response.data.remaining_seconds;
        setDevStatus(
          `Rate limited on server: ${remainingSeconds} seconds remaining`
        );
      } else {
        setDevStatus(
          "Error checking status: " +
            (error.response?.data?.detail || error.message)
        );
      }
    }
  };

  // Reset server rate limiting
  const resetServerRateLimiting = async () => {
    try {
      // Request to reset server rate limiting
      const response = await api.post("/api/reset-rate-limits/");
      setDevStatus(response.data.message || "Server rate limiting reset");
      // Also reset frontend
      resetRateLimiting();
    } catch (error) {
      setDevStatus(
        "Error resetting server: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="dev-tools">
      <div className="dev-header">Developer Tools</div>
      <div className="dev-buttons">
        <button
          type="button"
          className="dev-button"
          onClick={resetRateLimiting}
        >
          Reset Frontend
        </button>
        <button
          type="button"
          className="dev-button"
          onClick={checkServerStatus}
        >
          Check Status
        </button>
        <button
          type="button"
          className="dev-button"
          onClick={resetServerRateLimiting}
        >
          Reset Server
        </button>
      </div>
      {devStatus && <div className="dev-status">{devStatus}</div>}
      <div className="dev-tip">Press Ctrl+Shift+D to hide this panel</div>
    </div>
  );
}

export default DevTools;
