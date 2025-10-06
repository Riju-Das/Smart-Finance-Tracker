import LandingPage from "./pages/landingPage"
import LoginPage from "./pages/loginPage"
import RegisterPage from "./pages/registerPage"
import App from "./App.js"
import Dashboard from "./pages/dashboard"
import TransactionPage from "./pages/transactionPage"
import CategoryPage from "./pages/categoryPage"

const route = [
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/transactions",
        element: <TransactionPage />
      },
      {
        path: "/category",
        element: <CategoryPage />
      }
    ]


  }
]

export default route