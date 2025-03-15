import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './components/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CheckInPage from './pages/CheckInPage';
import ForumPage from './pages/ForumPage';
import HistorySection from './pages/HistorySection';
import ImpactPage from './pages/ImpactPage';
import CertificatePage from './pages/CertificatePage';
import ParceriaPage from './pages/ParceriasPage';
import CreateAccount from './pages/CreateAccount';
import ECOlições from './pages/ECOlições';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth(); // Inicializa a autenticação ao carregar a página
  }, [initAuth]);

  return (
    <AuthProvider>
    <Router>
      <div className="flex flex-col min-h-screen">

        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/HistorySection" element={<HistorySection />} />
            <Route path="/ImpactPage" element={<ImpactPage />} />
            <Route path="/CertificatePage" element={<CertificatePage />} />
            <Route path="/ParceriasPage" element={<ParceriaPage />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
            <Route path="/ECOlições" element={<ECOlições />} />
            <Route path="/CheckInPage" element={<CheckInPage />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;