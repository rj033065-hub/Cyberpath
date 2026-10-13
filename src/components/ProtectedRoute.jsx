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
          <div className="w-12 h-12 rounded-xl bg-[#111821] border border-[#2f81f7]/50 flex items-center justify-center text-[#58a6ff] shadow-lg shadow-[#2f81f7]/20 animate-pulse">
            <Shield className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-sm font-mono text-[#8b98a8]">
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
