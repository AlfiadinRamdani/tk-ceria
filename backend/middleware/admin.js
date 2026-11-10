export default function wajibAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ pesan: "Akses ditolak. Hanya admin yang diizinkan." });
  }
  next();
}
