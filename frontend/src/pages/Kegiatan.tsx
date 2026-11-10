import { useEffect, useState } from "react";
import { api, getFullImageUrl } from "../api";
import { Activity } from "../types";

export default function KegiatanPage() {
  const [items, setItems] = useState<Activity[]>([]);

  useEffect(() => {
    api<Activity[]>("/kegiatan").then(setItems).catch(console.error);
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <span className="eyebrow">BELAJAR DENGAN GEMBIRA</span>
        <h1>Kegiatan Seru Kami 🎨</h1>
        <p>
          Setiap hari adalah kesempatan baru untuk mencoba hal menyenangkan.
        </p>
      </div>
      <div className="cards">
        {items.map((a) => (
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
                {new Date(a.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </small>
              <h3>{a.judul}</h3>
              <p>{a.deskripsi}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
