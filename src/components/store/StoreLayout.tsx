
import React, { ReactNode } from 'react';
import StoreHeaderWithLanguage from './StoreHeaderWithLanguage';
import StoreFooter from './StoreFooter';
import SocialMediaIcons from '../SocialMediaIcons';
import { useScrollToTop } from '@/hooks/useScrollToTop';

type StoreLayoutProps = {
  children: ReactNode;
};

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  // Ensure every page scrolls to top on navigation
  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeaderWithLanguage />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
      <SocialMediaIcons />
    </div>
  );
};

export default StoreLayout;
