import React from 'react';
import { UserProfileCard } from './UserProfileCard';
import { CommunitiesCard } from '../../pages/community/CommunnityCard';
import { EventsCard } from './EventsCard';

export const RightPanel: React.FC = () => {
  return (
    <aside className="hidden lg:block w-80 p-4 shrink-0">
      <div className="space-y-4">
        <UserProfileCard />
        <CommunitiesCard />
        <EventsCard />
      </div>
    </aside>
  );
};