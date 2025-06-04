import React from 'react';
import { Header } from '../pages/Header';
import { Sidebar } from '../pages/Sidebar';
import { Feed } from '../pages/Feed';
import { RightPanel } from '../pages/RightPanel';
import { Footer } from '../pages/FooterCM';
import { CommunityProfile } from '../pages/CommunityProfile';

function App() {
  // Simular roteamento - em um caso real, use react-router-dom
  const [showCommunityProfile, setShowCommunityProfile] = React.useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Header />
      {showCommunityProfile ? (
        <CommunityProfile />
      ) : (
        <main className="flex flex-1 flex-col md:flex-row">
          <Sidebar />
          <Feed />
          <RightPanel />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App