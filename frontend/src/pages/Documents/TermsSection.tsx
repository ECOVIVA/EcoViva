import React, { ReactNode } from 'react';

interface TermsSectionProps {
  number: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const TermsSection: React.FC<TermsSectionProps> = ({ number, title, icon, children }) => {
  return (
    <section className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-green-800">
          {number}. {title}
        </h2>
      </div>
      <div className="pl-4 border-l-2 border-green-200">
        {children}
      </div>
    </section>
  );
};

export default TermsSection;