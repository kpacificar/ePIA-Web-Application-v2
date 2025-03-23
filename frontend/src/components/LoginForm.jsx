import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const navigate = useNavigate();

  // Handle countdown timer for rate limiting
  useEffect(() => {
    let timer;
    if (isRateLimited && cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (cooldownTime === 0 && isRateLimited) {
      setIsRateLimited(false);
    }

    return () => clearTimeout(timer);
  }, [cooldownTime, isRateLimited]);

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
      navigate("/");
    } catch (error) {
      // Handle rate limiting errors
      if (error.response && error.response.status === 429) {
        setIsRateLimited(true);

        // Extract cooldown time if available in the error message
        const message = error.response.data.detail || "";
        const timeMatch = message.match(/(\d+) seconds/);

        if (timeMatch && timeMatch[1]) {
          setCooldownTime(parseInt(timeMatch[1]));
        } else {
          // Default cooldown time if not specified
          setCooldownTime(60);
        }

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
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Log in</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="youremail@domain.com"
          disabled={isRateLimited}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={isRateLimited}
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
