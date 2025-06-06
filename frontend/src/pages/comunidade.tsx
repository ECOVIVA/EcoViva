import React, { useState } from 'react';
import { Header } from '../pages/Header';
import { Sidebar } from '../pages/Sidebar';
import { Feed } from './community/Feed';
import { RightPanel } from '../pages/RightPanel';
import { Footer } from '../pages/FooterCM';
import { CommunityProfile } from '../pages/CommunityProfile';
import { PostProvider } from '../components/Auth/context/post-context';
import CreateEvent from "../pages/create-event";

export default function Page() {
  const [activeView, setActiveView] = useState<"feed" | "create-event">("feed");
  const [showCommunityProfile, setShowCommunityProfile] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Header />

      {showCommunityProfile ? (
        <CommunityProfile />
      ) : (
        <main className="flex flex-1 flex-col md:flex-row bg-gray-50">
          <Sidebar />

          <PostProvider>
            <div className="w-full flex justify-center px-4 md:px-6 py-4">
              <div className="w-full max-w-2xl">
                {activeView === "feed" && (
                  <Feed onCreateEvent={() => setActiveView("create-event")} />
                )}
                {activeView === "create-event" && (
                  <CreateEvent onBack={() => setActiveView("feed")} />
                )}
              </div>
            </div>
          </PostProvider>

          <RightPanel />
        </main>
      )}

      <Footer />
    </div>
  );
}
