import { Router } from "express";
import { bacaFile, tulisFile } from "../utils/fileDb.js";
import wajibLogin from "../middleware/auth.js";
import wajibAdmin from "../middleware/admin.js";

const router = Router();

// Harus login untuk melihat data guru
router.get("/", wajibLogin, async (_req, res, next) => {
  try {
    res.json(await bacaFile("guru.json"));
  } catch (e) {
    next(e);
  }
});

router.post("/", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const { nama, jabatan, deskripsi, foto } = req.body;
    if (!nama?.trim()) return res.status(400).json({ pesan: "Nama wajib diisi" });
    const data = await bacaFile("guru.json");
    const item = {
      id: Date.now(),
      nama: nama.trim(),
      jabatan: jabatan?.trim() || "",
      deskripsi: deskripsi?.trim() || "",
      foto: foto || "",
    };
    data.push(item);
    await tulisFile("guru.json", data);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const { nama, jabatan, deskripsi, foto } = req.body;
    const data = await bacaFile("guru.json");
    const idx = data.findIndex((x) => x.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ pesan: "Guru tidak ditemukan" });

    if (nama?.trim()) data[idx].nama = nama.trim();
    if (jabatan !== undefined) data[idx].jabatan = jabatan.trim();
    if (deskripsi !== undefined) data[idx].deskripsi = deskripsi.trim();
    if (foto !== undefined) data[idx].foto = foto;

    await tulisFile("guru.json", data);
    res.json(data[idx]);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const data = await bacaFile("guru.json");
    const hasil = data.filter((x) => x.id !== Number(req.params.id));
    if (hasil.length === data.length) return res.status(404).json({ pesan: "Guru tidak ditemukan" });
    await tulisFile("guru.json", hasil);
    res.json({ pesan: "Guru dihapus" });
  } catch (e) {
    next(e);
  }
});

export default router;
