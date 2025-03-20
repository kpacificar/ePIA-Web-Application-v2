import Form from "../components/Form";
import { Link } from "react-router-dom";
import "../styles/Form.css";

export default function Register() {
  return (
    <div className="auth-container">
      <Form route="/api/user/register/" method="register" />
      <div className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
