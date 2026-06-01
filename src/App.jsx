import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/storage';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GalleryUpload from './pages/GalleryUpload';
import WebsiteSettings from './pages/WebsiteSettings';

// New Admin CRM Pages
import MediaManager from './pages/admin/MediaManager';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import CareerApplications from './pages/admin/CareerApplications';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* New Dynamic CMS Routes */}
          <Route path="media" element={<MediaManager />} />
          <Route path="contact-submissions" element={<ContactSubmissions />} />
          <Route path="careers" element={<CareerApplications />} />
          
          {/* Prevent direct access and redirect to dashboard */}
          <Route path="content" element={<Navigate to="/" replace />} />
          <Route path="content-editor" element={<Navigate to="/" replace />} />
          <Route path="services" element={<Navigate to="/" replace />} />
          <Route path="fleet" element={<Navigate to="/" replace />} />
          <Route path="contact" element={<Navigate to="/" replace />} />
          <Route path="contact-details" element={<Navigate to="/" replace />} />
          
          <Route path="gallery" element={<GalleryUpload />} />
          <Route path="settings" element={<WebsiteSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
