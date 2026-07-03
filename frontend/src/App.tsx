import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";
import DraftsPage from "./pages/DraftsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./components/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, logout, user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar
        isAuthenticated={isAuthenticated}
        userProfile={user ? { name: user.name } : undefined}
        onLogout={logout}
      />
      <main className="container mx-auto py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/posts/:id" element={<PostPage isAuthenticated={isAuthenticated} />} />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/categories" element={<CategoriesPage isAuthenticated={isAuthenticated} />} />
          <Route path="/tags" element={<TagsPage isAuthenticated={isAuthenticated} />} />
          <Route
            path="/posts/drafts"
            element={
              <ProtectedRoute>
                <DraftsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
