import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";

import Layout from "./Layout.jsx";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

import ScanPage from "./pages/ScanPage";
import WalletPage from "./pages/WalletPage";
import BonusPage from "./pages/BonusPage";
import PayPage from "./pages/PayPages.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth/login" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },

      { path: "admin", element: <Admin /> },

      {
        path: "scan",
        element: (
          <RequireAuth>
            <ScanPage />
          </RequireAuth>
        ),
      },
      {
        path: "wallet",
        element: (
          <RequireAuth>
            <WalletPage />
          </RequireAuth>
        ),
      },
      {
        path: "bonus",
        element: (
          <RequireAuth>
            <BonusPage />
          </RequireAuth>
        ),
      },
      {
        path: "pay",
        element: (
          <RequireAuth>
            <PayPage />
          </RequireAuth>
        ),
      },

      { path: "*", element: <div className="card">404</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
  </React.StrictMode>
);
