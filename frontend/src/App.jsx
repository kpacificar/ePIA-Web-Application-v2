import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ACCESS_TOKEN } from "./constants";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <BrowserRouter>
      <Layout isAuthenticated={isAuthenticated}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
