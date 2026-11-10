import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Lock } from "lucide-react";
import { api, getFullImageUrl } from "../api";
import { Activity, User } from "../types";

export default function BerandaPage({ user }: { user: User | null }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      api<Activity[]>("/kegiatan")
        .then(setActivities)
        .catch(console.error);
    }
  }, [user]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} /> TEMPAT TUMBUH PENUH CERITA
          </span>
          <h1>
            Setiap Anak Punya <span>Cara Hebat</span> untuk Bersinar!
          </h1>
          <p>
            Lingkungan belajar yang aman, hangat, dan menyenangkan untuk
            menemani langkah pertama si kecil.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link className="btn-primary" to="/kegiatan">
                Jelajahi Kegiatan
              </Link>
            ) : (
              <>
                <Link className="btn-primary" to="/login">
                  Masuk Sekarang
                </Link>
                <Link className="btn-light" to="/register">
                  Daftar Akun
                </Link>
              </>
            )}
          </div>
          <div className="hero-note">💛 Belajar sambil bermain setiap hari</div>
        </div>
        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000"
            alt="Anak-anak sedang belajar dan bermain"
          />
          <div className="float-card">
            🌟 <b>Tempat bermain &amp; belajar</b>
          </div>
        </div>
      </section>

      <section className="features">
        <div>
          <span>🧩</span>
          <h3>Belajar Kreatif</h3>
          <p>Aktivitas seru yang merangsang rasa ingin tahu.</p>
        </div>
        <div>
          <span>🤝</span>
          <h3>Guru Penyayang</h3>
          <p>Pendampingan penuh perhatian untuk setiap anak.</p>
        </div>
        <div>
          <span>🌳</span>
          <h3>Lingkungan Aman</h3>
          <p>Ruang tumbuh yang nyaman dan menyenangkan.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CERITA DI TK CERIA</span>
            <h2>Kegiatan Terbaru</h2>
          </div>
          {user && (
            <Link to="/kegiatan" className="text-link">
              Lihat semua →
            </Link>
          )}
        </div>

        {user ? (
          <div className="cards">
            {activities.slice(0, 3).map((a) => (
              <article className="activity-card" key={a.id}>
                {a.foto ? (
                  <div className="activity-img-wrap">
                    <img src={getFullImageUrl(a.foto)} alt={a.judul} />
                  </div>
                ) : (
                  <div className="activity-icon">{a.ikon}</div>
                )}
                <div className="activity-body">
                  <small>
                    {new Date(a.tanggal + "T00:00:00").toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </small>
                  <h3>{a.judul}</h3>
                  <p>{a.deskripsi}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="auth-required-box">
            <Lock size={36} />
            <h3>Data Kegiatan Terkunci</h3>
            <p>Silakan login atau daftar akun terlebih dahulu untuk melihat informasi kegiatan, guru, dan pendiri TK Ceria.</p>
            <div className="auth-required-actions">
              <Link to="/login" className="btn-primary">Login untuk Melihat</Link>
              <Link to="/register" className="btn-light">Daftar Akun</Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
