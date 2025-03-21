import RegisterForm from "../components/RegisterForm";
import Footer from "../components/layout/Footer";
import "../styles/Form.css";

export default function Register() {
  return (
    <>
      <div className="auth-container">
        <RegisterForm />
      </div>
      <Footer />
    </>
  );
}
