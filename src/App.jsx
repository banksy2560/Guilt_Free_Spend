import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ThreeScene from './components/ThreeScene';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;
      setScrollProgress(progress);
    };

    // Initial check
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]); // Re-check when route changes

  const isDashboard = location.pathname === '/app';
  // Fast-forward the 3D camera to the end state when on the Dashboard
  const activeProgress = isDashboard ? 1.0 : scrollProgress;

  return (
    <div className="relative min-h-screen bg-[#06060f] text-white selection:bg-violet-500/30">
      {/* Global 3D Background */}
      <ThreeScene scrollProgress={activeProgress} />

      {/* Routable Content Layer */}
      <div className="relative z-10 w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
