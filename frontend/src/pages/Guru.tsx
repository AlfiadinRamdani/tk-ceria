import { useEffect, useState } from "react";
import { api, getFullImageUrl } from "../api";
import { Teacher } from "../types";

export default function GuruPage() {
  const [items, setItems] = useState<Teacher[]>([]);

  useEffect(() => {
    api<Teacher[]>("/guru").then(setItems).catch(console.error);
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <span className="eyebrow">TIM PENDAMPING</span>
        <h1>Guru Hebat TK Ceria 👩‍🏫</h1>
        <p>Orang-orang hebat yang menemani proses tumbuh dan belajar.</p>
      </div>
      <div className="cards teacher-cards">
        {items.map((t) => (
          <article className="teacher-card" key={t.id}>
            <img src={getFullImageUrl(t.foto)} alt={t.nama} />
            <div>
              <h3>{t.nama}</h3>
              <span>{t.jabatan}</span>
              <p>{t.deskripsi}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
