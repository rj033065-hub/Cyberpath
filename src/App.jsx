import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AIAssistantProvider } from "./context/AIAssistantContext";
import AILabMentor from "./components/labs/AILabMentor";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import DemoOne from "./components/ui/demo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import PathCurriculum from "./pages/PathCurriculum";
import LessonView from "./pages/LessonView";
import ResourceExplorer from "./pages/ResourceExplorer";
import Profile from "./pages/Profile";
import BackgroundLayer from "./components/background/BackgroundLayer";
import LabCatalog from "./pages/LabCatalog";
import SQLiLab from "./pages/labs/SQLiLab";
import XSSLab from "./pages/labs/XSSLab";
import IDORLab from "./pages/labs/IDORLab";
import AuthCheckpointLab from "./pages/labs/AuthCheckpointLab";

import "./App.css";

// Background system is now handled by BackgroundLayer component.

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AIAssistantProvider>
          {/* Site-wide animated background */}
          <BackgroundLayer />

          {/* Site-wide Global AI Assistant & AI Lab Mentor Floating Component */}
          <AILabMentor />

        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          {/* Ripple Grid Demo Route */}
          <Route path="/demo" element={<DemoOne />} />

          {/* Authentication Routes — constellation background NOT rendered here */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Student Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Interactive Security Labs */}
          <Route
            path="/labs"
            element={
              <ProtectedRoute>
                <LabCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labs/sqli-basics"
            element={
              <ProtectedRoute>
                <SQLiLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labs/xss-playground"
            element={
              <ProtectedRoute>
                <XSSLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labs/idor-investigation"
            element={
              <ProtectedRoute>
                <IDORLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labs/auth-checkpoint"
            element={
              <ProtectedRoute>
                <AuthCheckpointLab />
              </ProtectedRoute>
            }
          />

          {/* CTF and Guided Lab Explorer (Phase 4.4) */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ResourceExplorer />
              </ProtectedRoute>
            }
          />

          {/* Student Profile & Achievements (Phase 4.5) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Interactive Learning Engine Routes */}
          <Route
            path="/learn/:pathSlug"
            element={
              <ProtectedRoute>
                <PathCurriculum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:pathSlug/:lessonSlug"
            element={
              <ProtectedRoute>
                <LessonView />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AIAssistantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
