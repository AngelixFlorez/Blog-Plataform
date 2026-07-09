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
import MyLikesPage from "./pages/MyLikesPage";
import MySavesPage from "./pages/MySavesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./components/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import KeepAlive from "./components/KeepAlive";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-500 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <NavBar
          isAuthenticated={isAuthenticated}
          userProfile={user ? { name: user.name } : undefined}
          onLogout={logout}
        />
        <main>
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
            <Route
              path="/posts/:id"
              element={<PostPage isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={<CategoriesPage isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/tags"
              element={<TagsPage isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/posts/drafts"
              element={
                <ProtectedRoute>
                  <DraftsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-likes"
              element={
                <ProtectedRoute>
                  <MyLikesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-saves"
              element={
                <ProtectedRoute>
                  <MySavesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="text-center py-6 text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
          &copy; 2026 Bloggeo
        </footer>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <KeepAlive />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
