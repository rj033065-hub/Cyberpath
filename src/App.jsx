import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

import "./App.css";

// Background system is now handled by BackgroundLayer component.


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Site-wide animated background */}
        <BackgroundLayer />

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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
