import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <main className="page">
      <div className="page-title">
        <span className="eyebrow">RINGKASAN SEKOLAH</span>
        <h1>Dashboard TK Ceria 🌈</h1>
        <p>Selamat datang! Berikut informasi seputar TK Ceria.</p>
      </div>
      <div className="stats">
        <div>
          <span>👧</span>
          <b>120</b>
          <small>Siswa (contoh)</small>
        </div>
        <div>
          <span>👩‍🏫</span>
          <b>12</b>
          <small>Guru (contoh)</small>
        </div>
        <div>
          <span>📅</span>
          <b>24</b>
          <small>Kegiatan (contoh)</small>
        </div>
      </div>
      <div className="dashboard-links">
        <Link to="/kegiatan">📚 Kelola informasi kegiatan →</Link>
        <Link to="/guru">👩‍🏫 Lihat profil guru →</Link>
        <Link to="/pendiri">💛 Tentang pendiri →</Link>
      </div>
    </main>
  );
}
