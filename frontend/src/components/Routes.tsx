import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

// Components
import Navbar from './dry/Navbar'
import Footer from './dry/Footer'
import ProtectedRoute from '../components/Auth/ProtectRoute'

// Pages
import HomePage from '../pages/EcoViva_pages/HomePage'
import LoginPage from '../pages/Checkin/LoginPage'
import CheckInPage from '../pages/CheckInPage'
import ForumPage from '../pages/EcoViva_pages/ForumPage'
import HistorySection from '../pages/EcoViva_pages/HistorySection'
import ImpactPage from '../pages/EcoViva_pages/ImpactPage'
import CertificatePage from '../pages/EcoViva_pages/CertificatePage'
import ParceriaPage from '../pages/EcoViva_pages/ParceriasPage'
import CreateAccount from '../pages/Checkin/CreateAccount'
import ECOstudy from '../pages/ECOstudy'
import ProfilePage from '../pages/EcoViva_pages/ProfilePage'
import ConfirmEmail from '../pages/email/ConfirmEmail'
import RequestPassword from '../pages/email/RequestPasswordReset'
import ResetPassword from '../pages/email/ResetPassword'
import ThreadDetailPage from '../pages/community/ThreadPage'
import TermosDeUso from '../pages/Documents/TermosDeUso'
import PolíticadeUsodeCookies from '../pages/Documents/PolíticadeUsodeCookies'
import Comunidade from '../pages/community/comunidade'
import { CommunityProfile } from '../pages/community/CommunityProfile'


const HideLayoutRoutes = ['/login', '/CreateAccount', '/RequestPassword']

// Hook para verificar se a rota atual deve esconder o layout
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const shouldHideLayout = HideLayoutRoutes.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow pt-20 ${shouldHideLayout ? 'pt-0' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

const RouterComponent: React.FC = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Forum" element={<ForumPage />} />
          <Route path="/HistorySection" element={<HistorySection />} />
          <Route path="/ImpactPage" element={<ImpactPage />} />
          <Route path="/CertificatePage" element={<CertificatePage />} />
          <Route path="/ParceriasPage" element={<ParceriaPage />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/Comunidade" element={<Comunidade />} />
          <Route path="/RequestPassword" element={<RequestPassword />} />
          <Route path="/ECOstudy" element={<ECOstudy />} />
          <Route path="/CommunityProfile" element={<CommunityProfile />} />
          <Route path="/ProfilePage"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

          <Route
            path="/CheckInPage"
            element={
              <ProtectedRoute>
                <CheckInPage />
              </ProtectedRoute>
            }
          />

          <Route path="/ConfirmEmail/:uidb64/:token" element={<ConfirmEmail />} />
          <Route path="/ResetPassword/:uidb64/:token" element={<ResetPassword />} />
          <Route path="/forum/:slug" element={<ThreadDetailPage />} />
          <Route path="/TermosDeUso" element={<TermosDeUso />} />
          <Route path="/PolíticadeUsodeCookies" element={<PolíticadeUsodeCookies />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  )
}

export default RouterComponent
