import {
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Station from "./pages/Stations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/registrasi",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/employees",
    element: <Employee />,
  },
  {
    path: "/stations",
    element: <Station />,
  }


]);

export default router;

