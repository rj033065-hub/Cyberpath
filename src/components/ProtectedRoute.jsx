import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CyberPathLogo from "./common/CyberPathLogo";

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
      <div className="min-h-screen bg-page text-fg flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CyberPathLogo size="lg" glow className="animate-pulse" />
          <div className="text-sm font-mono text-muted">
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
