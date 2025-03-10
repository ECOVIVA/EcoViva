import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore'; 

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

function App() {
  const { isAuthenticated, initAuth } = useAuthStore(); 

  useEffect(() => {
    initAuth(); // Inicialize a autenticação ao carregar a página
  }, [initAuth]); // Garantir que o useEffect não dispare novamente desnecessariamente

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/checkin" 
              element={
                isAuthenticated ? <CheckInPage /> : <Navigate to="/login" />
              } 
            />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/HistorySection" element={<HistorySection />} />
            <Route path="/ImpactPage" element={<ImpactPage />} />
            <Route path="/CertificatePage" element={<CertificatePage />} />
            <Route path="/ParceriasPage" element={<ParceriaPage />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
