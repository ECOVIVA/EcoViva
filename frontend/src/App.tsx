import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import ECOlições from './pages/ECOstudy';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
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
              <Route path="/ECOstudy" element={<ECOlições />} />
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