import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { User } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BerandaPage,
  KegiatanPage,
  PendiriPage,
  GuruPage,
  DashboardPage,
  AuthPage,
  AdminPage,
} from "./pages";

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const v = localStorage.getItem("tk_user");
    return v ? JSON.parse(v) : null;
  });

  function login(u: User, t: string) {
    localStorage.setItem("tk_user", JSON.stringify(u));
    localStorage.setItem("tk_token", t);
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("tk_user");
    localStorage.removeItem("tk_token");
    setUser(null);
  }

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<BerandaPage user={user} />} />
        <Route
          path="/login"
          element={<AuthPage mode="login" onSuccess={login} />}
        />
        <Route
          path="/register"
          element={<AuthPage mode="register" onSuccess={login} />}
        />
        <Route
          path="/kegiatan"
          element={
            <ProtectedRoute user={user}>
              <KegiatanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pendiri"
          element={
            <ProtectedRoute user={user}>
              <PendiriPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru"
          element={
            <ProtectedRoute user={user}>
              <GuruPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminPage />
            ) : (
              <AuthPage mode="login" onSuccess={login} />
            )
          }
        />
        <Route path="*" element={<BerandaPage user={user} />} />
      </Routes>
      <Footer />
    </>
  );
}
