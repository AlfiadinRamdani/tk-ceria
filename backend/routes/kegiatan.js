import { Router } from "express";
import { bacaFile, tulisFile } from "../utils/fileDb.js";
import wajibLogin from "../middleware/auth.js";
import wajibAdmin from "../middleware/admin.js";

const router = Router();

// Harus login untuk melihat data kegiatan
router.get("/", wajibLogin, async (_req, res, next) => {
  try {
    res.json(await bacaFile("kegiatan.json"));
  } catch (e) {
    next(e);
  }
});

router.post("/", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const { judul, tanggal, deskripsi, ikon = "📚", foto = "" } = req.body;
    if (!judul?.trim() || !tanggal || !deskripsi?.trim()) {
      return res.status(400).json({ pesan: "Judul, tanggal, dan deskripsi wajib diisi" });
    }
    const data = await bacaFile("kegiatan.json");
    const item = {
      id: Date.now(),
      judul: judul.trim(),
      tanggal,
      deskripsi: deskripsi.trim(),
      ikon,
      foto,
    };
    data.push(item);
    await tulisFile("kegiatan.json", data);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const { judul, tanggal, deskripsi, ikon, foto } = req.body;
    const data = await bacaFile("kegiatan.json");
    const idx = data.findIndex((x) => x.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ pesan: "Kegiatan tidak ditemukan" });

    if (judul?.trim()) data[idx].judul = judul.trim();
    if (tanggal) data[idx].tanggal = tanggal;
    if (deskripsi?.trim()) data[idx].deskripsi = deskripsi.trim();
    if (ikon !== undefined) data[idx].ikon = ikon;
    if (foto !== undefined) data[idx].foto = foto;

    await tulisFile("kegiatan.json", data);
    res.json(data[idx]);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const data = await bacaFile("kegiatan.json");
    const hasil = data.filter((x) => x.id !== Number(req.params.id));
    if (hasil.length === data.length) return res.status(404).json({ pesan: "Kegiatan tidak ditemukan" });
    await tulisFile("kegiatan.json", hasil);
    res.json({ pesan: "Kegiatan dihapus" });
  } catch (e) {
    next(e);
  }
});

export default router;
