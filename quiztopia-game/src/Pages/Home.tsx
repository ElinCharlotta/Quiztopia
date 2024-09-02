import LoginForm from "../Components/LoginForm/LoginForm";
import SignupForm from "../Components/SignupForm/SignupForm";
import './Home.scss'

export default function Home() {
  return (
    <>
      <h1>Välkommen till Quiztopia!</h1>

      <SignupForm />

      <LoginForm />
    </>
  )
}
