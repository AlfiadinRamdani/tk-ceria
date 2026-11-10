import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CalendarDays, Heart, Home, LogOut, Menu, Users, X, Shield, Lock } from "lucide-react";
import { User } from "../types";

export default function Header({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Beranda", icon: <Home size={18} /> },
    { to: "/kegiatan", label: "Kegiatan", icon: <CalendarDays size={18} /> },
    { to: "/pendiri", label: "Pendiri", icon: <Heart size={18} /> },
    { to: "/guru", label: "Guru", icon: <Users size={18} /> },
  ];

  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-icon">🌈</span>
        <span>
          TK CERIA<small>Belajar • Bermain • Bertumbuh</small>
        </span>
      </Link>
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Buka menu"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav open" : "nav"}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
            {l.icon}
            {l.label}
            {!user && l.to !== "/" && <Lock size={12} style={{ opacity: 0.5, marginLeft: "2px" }} />}
          </NavLink>
        ))}
        {user?.role === "admin" && (
          <NavLink to="/admin" onClick={() => setOpen(false)}>
            <Shield size={18} />
            Admin
          </NavLink>
        )}
        {user ? (
          <>
            <span className="user-label">
              Hai, {user.nama}
              {user.role === "admin" && (
                <span className="role-badge">Admin</span>
              )}
            </span>
            <button className="nav-logout" onClick={onLogout}>
              <LogOut size={17} /> Keluar
            </button>
          </>
        ) : (
          <>
            <Link className="nav-login" to="/login">
              Login
            </Link>
            <Link className="nav-register" to="/register">
              Daftar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
