import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Shield, Plus, Pencil, Trash2, Save, X, Upload } from "lucide-react";
import { api, uploadImage, getFullImageUrl } from "../api";
import { Activity, Teacher, Founder } from "../types";

export default function AdminPage() {
  const [tab, setTab] = useState<"kegiatan" | "guru" | "pendiri">("kegiatan");
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);
  const [uploading, setUploading] = useState(false);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Kegiatan State ──
  const [kegiatan, setKegiatan] = useState<Activity[]>([]);
  const [kForm, setKForm] = useState({
    judul: "",
    tanggal: "",
    deskripsi: "",
    ikon: "📚",
    foto: "",
  });
  const [editK, setEditK] = useState<Activity | null>(null);
  const loadKegiatan = () =>
    api<Activity[]>("/kegiatan")
      .then(setKegiatan)
      .catch(() => showToast("Gagal memuat kegiatan", "err"));

  // ── Guru State ──
  const [guru, setGuru] = useState<Teacher[]>([]);
  const [gForm, setGForm] = useState({
    nama: "",
    jabatan: "",
    deskripsi: "",
    foto: "",
  });
  const [editG, setEditG] = useState<Teacher | null>(null);
  const loadGuru = () =>
    api<Teacher[]>("/guru")
      .then(setGuru)
      .catch(() => showToast("Gagal memuat guru", "err"));

  // ── Pendiri State ──
  const [pendiri, setPendiri] = useState<Founder>({
    nama: "",
    jabatan: "",
    deskripsi: "",
    foto: "",
  });
  const loadPendiri = () =>
    api<Founder>("/pendiri")
      .then(setPendiri)
      .catch(() => showToast("Gagal memuat pendiri", "err"));

  useEffect(() => {
    loadKegiatan();
    loadGuru();
    loadPendiri();
  }, []);

  // ── Helper Upload File ──
  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
      showToast("Gambar berhasil di-upload!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal upload gambar", "err");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  }

  // ── Kegiatan CRUD ──
  async function addKegiatan(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/kegiatan", { method: "POST", body: JSON.stringify(kForm) });
      setKForm({ judul: "", tanggal: "", deskripsi: "", ikon: "📚", foto: "" });
      loadKegiatan();
      showToast("Kegiatan berhasil ditambahkan!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  async function updateKegiatan(e: FormEvent) {
    e.preventDefault();
    if (!editK) return;
    try {
      await api(`/kegiatan/${editK.id}`, {
        method: "PUT",
        body: JSON.stringify(editK),
      });
      setEditK(null);
      loadKegiatan();
      showToast("Kegiatan berhasil diperbarui!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  async function deleteKegiatan(id: number, judul: string) {
    if (!confirm(`Hapus kegiatan "${judul}"?`)) return;
    try {
      await api(`/kegiatan/${id}`, { method: "DELETE" });
      loadKegiatan();
      showToast("Kegiatan dihapus!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  // ── Guru CRUD ──
  async function addGuru(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/guru", { method: "POST", body: JSON.stringify(gForm) });
      setGForm({ nama: "", jabatan: "", deskripsi: "", foto: "" });
      loadGuru();
      showToast("Guru berhasil ditambahkan!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  async function updateGuru(e: FormEvent) {
    e.preventDefault();
    if (!editG) return;
    try {
      await api(`/guru/${editG.id}`, {
        method: "PUT",
        body: JSON.stringify(editG),
      });
      setEditG(null);
      loadGuru();
      showToast("Data guru berhasil diperbarui!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  async function deleteGuru(id: number, nama: string) {
    if (!confirm(`Hapus guru "${nama}"?`)) return;
    try {
      await api(`/guru/${id}`, { method: "DELETE" });
      loadGuru();
      showToast("Guru dihapus!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  // ── Pendiri Update ──
  async function updatePendiri(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/pendiri", { method: "PUT", body: JSON.stringify(pendiri) });
      loadPendiri();
      showToast("Data pendiri berhasil diperbarui!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal", "err");
    }
  }

  return (
    <main className="page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header">
        <Shield size={28} />
        <div>
          <h1>Panel Admin</h1>
          <p>Kelola data Kegiatan, Guru, dan Pendiri TK Ceria</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={tab === "kegiatan" ? "active" : ""}
          onClick={() => setTab("kegiatan")}
        >
          📅 Kegiatan
        </button>
        <button
          className={tab === "guru" ? "active" : ""}
          onClick={() => setTab("guru")}
        >
          👩‍🏫 Guru
        </button>
        <button
          className={tab === "pendiri" ? "active" : ""}
          onClick={() => setTab("pendiri")}
        >
          💛 Pendiri
        </button>
      </div>

      {/* ═══ TAB KEGIATAN ═══ */}
      {tab === "kegiatan" && (
        <div className="admin-section">
          <h2>Tambah Kegiatan Baru</h2>
          <form className="admin-form" onSubmit={addKegiatan}>
            <label>
              Judul
              <input
                value={kForm.judul}
                onChange={(e) => setKForm({ ...kForm, judul: e.target.value })}
                placeholder="Judul kegiatan"
                required
              />
            </label>
            <label>
              Tanggal
              <input
                type="date"
                value={kForm.tanggal}
                onChange={(e) =>
                  setKForm({ ...kForm, tanggal: e.target.value })
                }
                required
              />
            </label>
            <label>
              Deskripsi
              <textarea
                value={kForm.deskripsi}
                onChange={(e) =>
                  setKForm({ ...kForm, deskripsi: e.target.value })
                }
                placeholder="Deskripsi kegiatan"
                required
              />
            </label>
            <label>
              Ikon (opsional emoji)
              <input
                value={kForm.ikon}
                onChange={(e) => setKForm({ ...kForm, ikon: e.target.value })}
                placeholder="📚"
              />
            </label>
            <label>
              Upload Foto Kegiatan (opsional)
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setKForm({ ...kForm, foto: url }))}
                  disabled={uploading}
                />
                {kForm.foto && (
                  <div className="upload-preview">
                    <img src={getFullImageUrl(kForm.foto)} alt="Preview Kegiatan" />
                    <button type="button" onClick={() => setKForm({ ...kForm, foto: "" })}>Hapus Foto</button>
                  </div>
                )}
              </div>
            </label>
            <button type="submit" className="btn-primary" disabled={uploading}>
              <Plus size={16} /> {uploading ? "Mengunggah..." : "Tambah"}
            </button>
          </form>

          <h2>Daftar Kegiatan ({kegiatan.length})</h2>
          {kegiatan.length === 0 ? (
            <p className="admin-empty">Belum ada kegiatan.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto / Ikon</th>
                    <th>Judul</th>
                    <th>Tanggal</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kegiatan.map((k) => (
                    <tr key={k.id}>
                      {editK?.id === k.id ? (
                        <>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {editK.foto ? (
                                <img src={getFullImageUrl(editK.foto)} alt="Foto" className="table-thumb" />
                              ) : (
                                <span className="icon-cell">{editK.ikon}</span>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ fontSize: "11px", maxWidth: "150px" }}
                                onChange={(e) => handleFileUpload(e, (url) => setEditK({ ...editK, foto: url }))}
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              value={editK.judul}
                              onChange={(e) =>
                                setEditK({ ...editK, judul: e.target.value })
                              }
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={editK.tanggal}
                              onChange={(e) =>
                                setEditK({ ...editK, tanggal: e.target.value })
                              }
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              value={editK.deskripsi}
                              onChange={(e) =>
                                setEditK({
                                  ...editK,
                                  deskripsi: e.target.value,
                                })
                              }
                              className="edit-input"
                            />
                          </td>
                          <td className="admin-actions">
                            <button
                              className="btn-save"
                              onClick={updateKegiatan as any}
                            >
                              <Save size={14} />
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => setEditK(null)}
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {k.foto ? (
                              <img src={getFullImageUrl(k.foto)} alt={k.judul} className="table-thumb" />
                            ) : (
                              <span className="icon-cell">{k.ikon}</span>
                            )}
                          </td>
                          <td>
                            <strong>{k.judul}</strong>
                          </td>
                          <td>
                            {new Date(
                              k.tanggal + "T00:00:00",
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>{k.deskripsi}</td>
                          <td className="admin-actions">
                            <button
                              className="btn-edit"
                              onClick={() => setEditK({ ...k })}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => deleteKegiatan(k.id, k.judul)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB GURU ═══ */}
      {tab === "guru" && (
        <div className="admin-section">
          <h2>Tambah Guru Baru</h2>
          <form className="admin-form" onSubmit={addGuru}>
            <label>
              Nama
              <input
                value={gForm.nama}
                onChange={(e) => setGForm({ ...gForm, nama: e.target.value })}
                placeholder="Nama lengkap guru"
                required
              />
            </label>
            <label>
              Jabatan
              <input
                value={gForm.jabatan}
                onChange={(e) =>
                  setGForm({ ...gForm, jabatan: e.target.value })
                }
                placeholder="Guru Kelas A"
              />
            </label>
            <label>
              Deskripsi
              <textarea
                value={gForm.deskripsi}
                onChange={(e) =>
                  setGForm({ ...gForm, deskripsi: e.target.value })
                }
                placeholder="Deskripsi singkat"
              />
            </label>
            <label>
              Upload Foto Guru
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setGForm({ ...gForm, foto: url }))}
                  disabled={uploading}
                />
                {gForm.foto && (
                  <div className="upload-preview">
                    <img src={getFullImageUrl(gForm.foto)} alt="Preview Guru" />
                    <button type="button" onClick={() => setGForm({ ...gForm, foto: "" })}>Hapus Foto</button>
                  </div>
                )}
              </div>
            </label>
            <button type="submit" className="btn-primary" disabled={uploading}>
              <Plus size={16} /> {uploading ? "Mengunggah..." : "Tambah"}
            </button>
          </form>

          <h2>Daftar Guru ({guru.length})</h2>
          {guru.length === 0 ? (
            <p className="admin-empty">Belum ada guru.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nama</th>
                    <th>Jabatan</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {guru.map((g) => (
                    <tr key={g.id}>
                      {editG?.id === g.id ? (
                        <>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {editG.foto ? (
                                <img src={getFullImageUrl(editG.foto)} alt="Foto" className="table-thumb" />
                              ) : (
                                <span>—</span>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ fontSize: "11px", maxWidth: "150px" }}
                                onChange={(e) => handleFileUpload(e, (url) => setEditG({ ...editG, foto: url }))}
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              value={editG.nama}
                              onChange={(e) =>
                                setEditG({ ...editG, nama: e.target.value })
                              }
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              value={editG.jabatan}
                              onChange={(e) =>
                                setEditG({ ...editG, jabatan: e.target.value })
                              }
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              value={editG.deskripsi}
                              onChange={(e) =>
                                setEditG({
                                  ...editG,
                                  deskripsi: e.target.value,
                                })
                              }
                              className="edit-input"
                            />
                          </td>
                          <td className="admin-actions">
                            <button
                              className="btn-save"
                              onClick={updateGuru as any}
                            >
                              <Save size={14} />
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => setEditG(null)}
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {g.foto ? (
                              <img
                                src={getFullImageUrl(g.foto)}
                                alt={g.nama}
                                className="table-thumb"
                              />
                            ) : (
                              <span>—</span>
                            )}
                          </td>
                          <td>
                            <strong>{g.nama}</strong>
                          </td>
                          <td>{g.jabatan}</td>
                          <td>{g.deskripsi}</td>
                          <td className="admin-actions">
                            <button
                              className="btn-edit"
                              onClick={() => setEditG({ ...g })}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => deleteGuru(g.id, g.nama)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB PENDIRI ═══ */}
      {tab === "pendiri" && (
        <div className="admin-section">
          <h2>Edit Data Pendiri</h2>
          <form className="admin-form" onSubmit={updatePendiri}>
            <label>
              Nama
              <input
                value={pendiri.nama}
                onChange={(e) =>
                  setPendiri({ ...pendiri, nama: e.target.value })
                }
                placeholder="Nama pendiri"
                required
              />
            </label>
            <label>
              Jabatan
              <input
                value={pendiri.jabatan}
                onChange={(e) =>
                  setPendiri({ ...pendiri, jabatan: e.target.value })
                }
                placeholder="Jabatan"
              />
            </label>
            <label>
              Deskripsi
              <textarea
                value={pendiri.deskripsi}
                onChange={(e) =>
                  setPendiri({ ...pendiri, deskripsi: e.target.value })
                }
                placeholder="Deskripsi tentang pendiri"
                rows={4}
              />
            </label>
            <label>
              Upload Foto Pendiri
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setPendiri({ ...pendiri, foto: url }))}
                  disabled={uploading}
                />
                {pendiri.foto && (
                  <div className="upload-preview">
                    <img src={getFullImageUrl(pendiri.foto)} alt="Preview Pendiri" />
                    <button type="button" onClick={() => setPendiri({ ...pendiri, foto: "" })}>Hapus Foto</button>
                  </div>
                )}
              </div>
            </label>
            <button type="submit" className="btn-primary" disabled={uploading}>
              <Save size={16} /> Simpan Perubahan
            </button>
          </form>
          {pendiri.foto && (
            <div className="pendiri-preview">
              <h3>Preview</h3>
              <div className="profile founder">
                <img src={getFullImageUrl(pendiri.foto)} alt={pendiri.nama} />
                <div>
                  <span className="eyebrow">{pendiri.jabatan}</span>
                  <h2>{pendiri.nama}</h2>
                  <p>{pendiri.deskripsi}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
