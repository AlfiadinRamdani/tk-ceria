import { ReactNode } from "react";
import { Navigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { User } from "../types";

export default function ProtectedRoute({
  user,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) {
  if (!user) {
    return (
      <main className="page">
        <div className="auth-required-box" style={{ maxWidth: "560px", margin: "60px auto" }}>
          <Lock size={44} />
          <h2>Akses Terbatas</h2>
          <p>
            Halaman dan data ini hanya dapat diakses oleh pengguna yang sudah memiliki akun dan login ke sistem TK Ceria.
          </p>
          <div className="auth-required-actions">
            <Link to="/login" className="btn-primary">
              Masuk Sekarang
            </Link>
            <Link to="/register" className="btn-light">
              Daftar Akun
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
