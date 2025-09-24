import LandingPage from "./pages/landingPage"
import LoginPage from "./pages/loginPage"
import RegisterPage from "./pages/registerPage"
import App from "./App"
import Dashboard from "./pages/dashboard"

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
  },
  {
    element: <App/>,
    children:[
      {
        path: "/dashboard",
        element:<Dashboard/>
      }
    ]

    
  }
]

export default route