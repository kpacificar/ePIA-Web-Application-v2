import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
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

    if (!password2) {
      formIsValid = false;
      tempErrors["password2"] = "Please confirm your password";
    } else if (password !== password2) {
      formIsValid = false;
      tempErrors["password2"] = "Passwords do not match";
    }

    if (!firstName) {
      formIsValid = false;
      tempErrors["firstName"] = "First name is required";
    }

    if (!lastName) {
      formIsValid = false;
      tempErrors["lastName"] = "Last name is required";
    }

    if (!companyName) {
      formIsValid = false;
      tempErrors["companyName"] = "Company name is required";
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
      const userData = {
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
      };

      await api.post("/api/user/register/", userData);
      navigate("/login");
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
    <form
      onSubmit={handleSubmit}
      className="form-container register-form-container"
    >
      <h1>Register</h1>

      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            className="form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            className="form-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Company Name</label>
        <input
          className="form-input"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
        />
      </div>

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

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          className="form-input"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Re-enter your password"
        />
      </div>

      {/* Display all errors in the same format */}
      {errors.firstName && (
        <div className="error-message general-error">{errors.firstName}</div>
      )}
      {errors.lastName && (
        <div className="error-message general-error">{errors.lastName}</div>
      )}
      {errors.companyName && (
        <div className="error-message general-error">{errors.companyName}</div>
      )}
      {errors.email && (
        <div className="error-message general-error">{errors.email}</div>
      )}
      {errors.password && (
        <div className="error-message general-error">{errors.password}</div>
      )}
      {errors.password2 && (
        <div className="error-message general-error">{errors.password2}</div>
      )}
      {errors.non_field_errors && (
        <div className="error-message general-error">
          {errors.non_field_errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <div className="terms-agreement">
        <p>By signing up, you agree to the Moward Consultancy Inc.'s</p>
        <p>
          <a href="#">Terms and Conditions</a> and{" "}
          <a href="#">Privacy Policy</a>
        </p>
      </div>

      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="auth-link-inline">
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
