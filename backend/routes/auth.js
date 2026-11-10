import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { bacaFile, tulisFile } from "../utils/fileDb.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;
    if (!nama?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ pesan: "Nama, email, dan password wajib diisi" });
    }
    if (password.length < 8) return res.status(400).json({ pesan: "Password minimal 8 karakter" });
    const users = await bacaFile("users.json");
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ pesan: "Email sudah terdaftar" });
    }
    const user = { id: Date.now(), nama: nama.trim(), email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 10), role: "user" };
    users.push(user);
    await tulisFile("users.json", users);
    res.status(201).json({ pesan: "Registrasi berhasil. Silakan login." });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await bacaFile("users.json");
    const user = users.find(u => u.email === String(email || "").toLowerCase());
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ pesan: "Email atau password salah" });
    }
    const token = jwt.sign({ id: user.id, nama: user.nama, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET || "development-secret-ganti-ini", { expiresIn: "1d" });
    res.json({ pesan: "Login berhasil", token, user: { id: user.id, nama: user.nama, email: user.email, role: user.role || "user" } });
  } catch (e) { next(e); }
});

export default router;
