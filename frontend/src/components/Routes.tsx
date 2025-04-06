import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {useAuth } from '../components/AuthContext';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CheckInPage from '../pages/CheckInPage';
import ForumPage from '../pages/ForumPage';
import HistorySection from '../pages/HistorySection';
import ImpactPage from '../pages/ImpactPage';
import CertificatePage from '../pages/CertificatePage';
import ParceriaPage from '../pages/ParceriasPage';
import CreateAccount from '../pages/CreateAccount';
import ECOstudy from '../pages/ECOstudy';
import ProfilePage from '../pages/ProfilePage';


const RouterComponent: React.FC = () => {
  const { isAuthenticated } = useAuth()
  return (
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
              <Route path="/ECOstudy" element={<ECOstudy />} />
              <Route path="/CheckInPage" element={isAuthenticated ? <CheckInPage /> : <Navigate to="/login" />} />
              <Route path="/ProfilePage" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
};

export default RouterComponent;
