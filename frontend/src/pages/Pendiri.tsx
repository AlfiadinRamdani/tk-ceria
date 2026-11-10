import { useEffect, useState } from "react";
import { api, getFullImageUrl } from "../api";
import { Founder } from "../types";

export default function PendiriPage() {
  const [data, setData] = useState<Founder | null>(null);

  useEffect(() => {
    api<Founder>("/pendiri").then(setData).catch(console.error);
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <span className="eyebrow">CERITA KAMI</span>
        <h1>Mengenal Pendiri TK Ceria</h1>
      </div>
      {data && (
        <div className="profile founder">
          <img src={getFullImageUrl(data.foto)} alt={data.nama} />
          <div>
            <span className="eyebrow">{data.jabatan}</span>
            <h2>{data.nama}</h2>
            <p>{data.deskripsi}</p>
          </div>
        </div>
      )}
    </main>
  );
}
