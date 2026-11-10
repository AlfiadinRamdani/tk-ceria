import jwt from "jsonwebtoken";

export default function wajibLogin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ pesan: "Silakan login terlebih dahulu" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "development-secret-ganti-ini");
    next();
  } catch {
    return res.status(401).json({ pesan: "Token tidak valid atau sudah kedaluwarsa" });
  }
}
