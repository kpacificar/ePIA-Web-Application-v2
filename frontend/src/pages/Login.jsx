import Form from "../components/Form";
import { Link } from "react-router-dom";
import "../styles/Form.css";

export default function Login() {
  return (
    <div className="auth-container">
      <Form route="/api/token/" method="login" />
      <div className="auth-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
