
import { RouteObject } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <Login />
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "reset-password",
      element: <ResetPassword />
    }
  ]
};

export default authRoutes;
