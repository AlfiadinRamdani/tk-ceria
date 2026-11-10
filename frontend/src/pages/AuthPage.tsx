import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { User } from "../types";

export default function AuthPage({
  mode,
  onSuccess,
}: {
  mode: "login" | "register";
  onSuccess: (u: User, t: string) => void;
}) {
  const nav = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "register" && password !== confirm) {
      setError("Konfirmasi password belum sama");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify({ nama, email, password }),
        });
        nav("/login");
        return;
      }
      const result = await api<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onSuccess(result.user, result.token);
      nav("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-art">
        <span>🌈</span>
        <h2>Langkah kecil hari ini, masa depan cerah esok hari.</h2>
        <p>Selamat datang di keluarga besar TK Ceria.</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">🌼</div>
        <span className="eyebrow">
          {mode === "login"
            ? "SELAMAT DATANG KEMBALI"
            : "MULAI PERJALANAN BARU"}
        </span>
        <h1>{mode === "login" ? "Login" : "Buat Akun"}</h1>
        <p>
          {mode === "login"
            ? "Masuk untuk melanjutkan."
            : "Daftarkan akun orang tua atau pengelola."}
        </p>
        {mode === "register" && (
          <label>
            Nama lengkap
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap"
              required
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            minLength={8}
            required
          />
        </label>
        {mode === "register" && (
          <label>
            Konfirmasi password
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </label>
        )}
        {error && <div className="error">{error}</div>}
        <button className="btn-primary full" disabled={busy}>
          {busy
            ? "Memproses..."
            : mode === "login"
              ? "Masuk"
              : "Daftar Sekarang"}
        </button>
        <div className="auth-switch">
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <Link to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Daftar" : "Login"}
          </Link>
        </div>
      </form>
    </div>
  );
}
