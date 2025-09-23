import LandingPage from "./pages/landingPage"
import LoginPage from "./pages/loginPage"
import RegisterPage from "./pages/registerPage"

const route = [
  {
    path:"/",
    element: <LandingPage/>
  },
  {
    path:"/login",
    element: <LoginPage/>
  },
  {
    path:"/register",
    element: <RegisterPage/>
  }
]

export default route