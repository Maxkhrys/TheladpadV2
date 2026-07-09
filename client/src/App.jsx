import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Book from './pages/Book';
import BookConfirmation from './pages/BookConfirmation';
import Services from './pages/Services';
import Barbers from './pages/Barbers';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-ink">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <ShopProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/book" element={<PublicLayout><Book /></PublicLayout>} />
            <Route path="/book/confirmation" element={<PublicLayout><BookConfirmation /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/barbers" element={<PublicLayout><Barbers /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute requireOwner>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </AnimatePresence>
      </ShopProvider>
    </AuthProvider>
  );
}
