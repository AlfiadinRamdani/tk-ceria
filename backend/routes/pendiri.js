import { Router } from "express";
import { bacaFile, tulisFile } from "../utils/fileDb.js";
import wajibLogin from "../middleware/auth.js";
import wajibAdmin from "../middleware/admin.js";

const router = Router();

// Harus login untuk melihat data pendiri
router.get("/", wajibLogin, async (_req, res, next) => {
  try {
    res.json(await bacaFile("pendiri.json", {}));
  } catch (e) {
    next(e);
  }
});

router.put("/", wajibLogin, wajibAdmin, async (req, res, next) => {
  try {
    const { nama, jabatan, deskripsi, foto } = req.body;
    const data = await bacaFile("pendiri.json", {});
    if (nama?.trim()) data.nama = nama.trim();
    if (jabatan !== undefined) data.jabatan = jabatan.trim();
    if (deskripsi !== undefined) data.deskripsi = deskripsi.trim();
    if (foto !== undefined) data.foto = foto;
    await tulisFile("pendiri.json", data);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
