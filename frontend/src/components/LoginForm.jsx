import { useState } from "react";
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
  const navigate = useNavigate();

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

    if (!validateForm()) {
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
      if (error.response && error.response.data) {
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
        />
      </div>

      {/* Display all errors in the same format */}
      {errors.email && (
        <div className="error-message general-error">{errors.email}</div>
      )}
      {errors.password && (
        <div className="error-message general-error">{errors.password}</div>
      )}
      {errors.non_field_errors && (
        <div className="error-message general-error">
          {errors.non_field_errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
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
