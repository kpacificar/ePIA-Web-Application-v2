import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Form({ route, method }) {
  // This component is kept for backward compatibility
  // It now delegates to the specialized form components
  return method === "login" ? <LoginForm /> : <RegisterForm />;
}

export default Form;
