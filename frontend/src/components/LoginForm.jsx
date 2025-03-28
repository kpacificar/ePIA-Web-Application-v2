import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import DevTools from "./DevTools";

// Constants for localStorage keys
const RATE_LIMIT_KEY = "login_rate_limited";
const COOLDOWN_TIME_KEY = "login_cooldown_time";
const COOLDOWN_END_KEY = "login_cooldown_end_time";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);
  const navigate = useNavigate();

  // Load rate limit status from localStorage on component mount
  useEffect(() => {
    const storedIsRateLimited = localStorage.getItem(RATE_LIMIT_KEY) === "true";
    const storedEndTime = parseInt(
      localStorage.getItem(COOLDOWN_END_KEY) || "0",
      10
    );

    if (storedIsRateLimited && storedEndTime > Date.now()) {
      setIsRateLimited(true);

      // Calculate remaining time in seconds
      const remainingTime = Math.ceil((storedEndTime - Date.now()) / 1000);
      setCooldownTime(remainingTime > 0 ? remainingTime : 0);
    } else if (storedIsRateLimited) {
      // Clear expired rate limit
      localStorage.removeItem(RATE_LIMIT_KEY);
      localStorage.removeItem(COOLDOWN_TIME_KEY);
      localStorage.removeItem(COOLDOWN_END_KEY);
    }
  }, []);

  // Handle countdown timer for rate limiting
  useEffect(() => {
    let timer;
    if (isRateLimited && cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime((prevTime) => prevTime - 1);
        // Update localStorage with new time
        localStorage.setItem(COOLDOWN_TIME_KEY, (cooldownTime - 1).toString());
      }, 1000);
    } else if (cooldownTime <= 0 && isRateLimited) {
      setIsRateLimited(false);
      // Clear localStorage when countdown ends
      localStorage.removeItem(RATE_LIMIT_KEY);
      localStorage.removeItem(COOLDOWN_TIME_KEY);
      localStorage.removeItem(COOLDOWN_END_KEY);
    }

    return () => clearTimeout(timer);
  }, [cooldownTime, isRateLimited]);

  // Add keyboard listener for dev tools
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show dev tools when pressing Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setShowDevTools((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!email) {
      formIsValid = false;
      tempErrors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formIsValid = false;
      tempErrors["email"] = "Email is not valid";
    }

    if (!password) {
      formIsValid = false;
      tempErrors["password"] = "Password is required";
    } else if (password.length < 8) {
      formIsValid = false;
      tempErrors["password"] = "Password must be at least 8 characters";
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isRateLimited) {
      return;
    }

    setLoading(true);

    try {
      const userData = { email, password };
      const res = await api.post("/api/token/", userData);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      // Navigate to the dashboard route where Home component is rendered
      navigate("/dashboard");
    } catch (error) {
      // Handle rate limiting errors
      if (error.response && error.response.status === 429) {
        setIsRateLimited(true);

        // Get remaining seconds from response
        const remainingSeconds = error.response.data.remaining_seconds || 60;
        setCooldownTime(remainingSeconds);

        // Store in localStorage with expiration time
        localStorage.setItem(RATE_LIMIT_KEY, "true");
        localStorage.setItem(COOLDOWN_TIME_KEY, remainingSeconds.toString());
        localStorage.setItem(
          COOLDOWN_END_KEY,
          (Date.now() + remainingSeconds * 1000).toString()
        );

        setErrors({
          non_field_errors: [
            "Too many login attempts. Please try again later.",
          ],
        });
      }
      // Handle authentication errors
      else if (error.response && error.response.data) {
        if (error.response.data.detail) {
          setErrors({
            non_field_errors: [error.response.data.detail],
          });
        } else {
          setErrors(error.response.data);
        }
      } else {
        setErrors({
          non_field_errors: ["An unexpected error occurred. Please try again."],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container" autoComplete="on">
      <h1>Log in</h1>
      {/* Use the DevTools component with new props */}
      {showDevTools && (
        <DevTools
          setIsRateLimited={setIsRateLimited}
          setCooldownTime={setCooldownTime}
        />
      )}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="youremail@domain.com"
          disabled={isRateLimited}
          autoComplete="username"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={isRateLimited}
          autoComplete="current-password"
          required
        />
      </div>

      {/* Display rate limit warning */}
      {isRateLimited && (
        <div className="error-message rate-limit-error">
          <p>Too many login attempts.</p>
          {cooldownTime > 0 && (
            <p>Please wait {cooldownTime} seconds before trying again.</p>
          )}
        </div>
      )}

      {/* Display all errors in the same format */}
      {!isRateLimited && errors.email && (
        <div className="error-message general-error">{errors.email}</div>
      )}
      {!isRateLimited && errors.password && (
        <div className="error-message general-error">{errors.password}</div>
      )}
      {!isRateLimited && errors.non_field_errors && (
        <div className="error-message general-error">
          {errors.non_field_errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {loading && <LoadingIndicator />}
      <button
        className="form-button"
        type="submit"
        disabled={loading || isRateLimited}
      >
        {loading
          ? "Logging in..."
          : isRateLimited
          ? `Try again in ${cooldownTime}s`
          : "Log in"}
      </button>
      <a href="#" className="forgot-password">
        Forgot Password?
      </a>
      <div className="auth-link-inline">
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
