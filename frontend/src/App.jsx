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
      <Routes>
        {/* Public routes with NavBar */}
        <Route
          path="/login"
          element={
            <Layout isAuthenticated={false}>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/logout"
          element={
            <Layout isAuthenticated={false}>
              <Logout />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout isAuthenticated={false}>
              <RegisterAndLogout />
            </Layout>
          }
        />

        {/* Dashboard route - only for authenticated users */}
        <Route
          path="/dashboard"
          element={
            <Layout isAuthenticated={true}>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* LandingPage with NavBar */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Layout isAuthenticated={false}>
                <LandingPage />
              </Layout>
            )
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <Layout isAuthenticated={false}>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
