import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {useAuth } from '../components/Auth/AuthContext';

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
import ConfirmEmail from '../pages/ConfirmEmail';
import RequestPassword from '../pages/RequestPasswordReset';
import ResetPassword from '../pages/ResetPassword';


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
              <Route path="/Forum" element={<ForumPage />} />
              <Route path="/HistorySection" element={<HistorySection />} />
              <Route path="/ImpactPage" element={<ImpactPage />} />
              <Route path="/CertificatePage" element={<CertificatePage />} />
              <Route path="/ParceriasPage" element={<ParceriaPage />} />
              <Route path="/CreateAccount" element={<CreateAccount />} />
              <Route path="/RequestPassword" element={<RequestPassword />} />
              <Route path="/ECOstudy" element={<ECOstudy />} />
              <Route path="/ProfilePage" element={<ProfilePage />} />
              <Route path="/CheckInPage" element={isAuthenticated ? <CheckInPage /> : <Navigate to="/login" />} />
              <Route path="/ConfirmEmail/:uidb64/:token" element={<ConfirmEmail />}/>     
              <Route path="/ResetPassword/:uidb64/:token" element={<ResetPassword />}/>         
    
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
};

export default RouterComponent;
