import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import kegiatanRoutes from "./routes/kegiatan.js";
import guruRoutes from "./routes/guru.js";
import pendiriRoutes from "./routes/pendiri.js";
import uploadRoutes from "./routes/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Sajikan folder uploads secara statis agar gambar dapat diakses frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => res.json({ pesan: "API TK Ceria aktif" }));
app.use("/api/auth", authRoutes);
app.use("/api/kegiatan", kegiatanRoutes);
app.use("/api/guru", guruRoutes);
app.use("/api/pendiri", pendiriRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ pesan: err.message || "Terjadi kesalahan pada server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend berjalan di http://localhost:${PORT}`));
