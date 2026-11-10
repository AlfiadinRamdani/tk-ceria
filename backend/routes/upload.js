import { Router } from "express";
import { upload } from "../middleware/upload.js";
import wajibLogin from "../middleware/auth.js";
import wajibAdmin from "../middleware/admin.js";

const router = Router();

router.post("/", wajibLogin, wajibAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ pesan: "Tidak ada file gambar yang diunggah" });
  }

  // URL relatif atau absolut yang bisa diakses oleh frontend
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    pesan: "Upload berhasil",
    url: imageUrl,
    filename: req.file.filename,
  });
});

export default router;
