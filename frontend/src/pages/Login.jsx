import LoginForm from "../components/LoginForm";
import Footer from "../components/layout/Footer";
import "../styles/Form.css";

export default function Login() {
  return (
    <>
      <div className="auth-container">
        <LoginForm />
      </div>
      <Footer />
    </>
  );
}
