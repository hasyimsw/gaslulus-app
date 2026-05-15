import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TryoutPage from './pages/TryoutPage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import BookmarkPage from './pages/BookmarkPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layouts/DashboardLayout';

function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
          duration: 3000,
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected - Dashboard Layout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tryout" element={<TryoutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/bookmark" element={<BookmarkPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin inside Dashboard Layout */}
          <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>

        {/* Exam (full screen) */}
        <Route path="/exam/:id" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/practice/:category/:subject" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/result/:id" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
