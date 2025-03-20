import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

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

    if (method === "register") {
      if (!password2) {
        formIsValid = false;
        tempErrors["password2"] = "Please confirm your password";
      } else if (password !== password2) {
        formIsValid = false;
        tempErrors["password2"] = "Passwords do not match";
      }
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
      if (method === "register") {
        userData.password2 = password2;
      }

      const res = await api.post(route, userData);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
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
      <h1>{name}</h1>
      <div className="form-group">
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      <div className="form-group">
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {errors.password && (
          <div className="error-message">{errors.password}</div>
        )}
      </div>
      {method === "register" && (
        <div className="form-group">
          <input
            className="form-input"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm Password"
          />
          {errors.password2 && (
            <div className="error-message">{errors.password2}</div>
          )}
        </div>
      )}
      {errors.non_field_errors && (
        <div className="error-message general-error">
          {errors.non_field_errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
