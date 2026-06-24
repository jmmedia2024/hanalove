import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import SupportPage from './pages/SupportPage';
import AdminPage from './pages/AdminPage';
import NoticeBoard from './pages/NoticeBoard';
import GalleryBoard from './pages/GalleryBoard';
import DynamicPage from './pages/DynamicPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/gallery" element={<GalleryBoard />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<DynamicPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}



