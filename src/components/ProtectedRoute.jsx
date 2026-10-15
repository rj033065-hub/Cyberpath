import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const hasUrlAuthTokens =
    typeof window !== "undefined" &&
    (location.search.includes("code=") ||
      location.hash.includes("access_token=") ||
      location.hash.includes("type=recovery"));

  if (loading || (!user && hasUrlAuthTokens)) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#101012] border border-white/20 flex items-center justify-center text-white shadow-lg shadow-white/5 animate-pulse">
            <Shield className="w-6 h-6 animate-spin text-white" />
          </div>
          <div className="text-sm font-mono text-[#a1a1aa]">
            Verifying security session...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while preserving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
