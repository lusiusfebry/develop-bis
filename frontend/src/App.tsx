import { Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import LoginPage from '@/pages/auth/LoginPage';
import WelcomePage from '@/pages/welcome/WelcomePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
