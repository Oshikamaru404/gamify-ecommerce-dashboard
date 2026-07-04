
import React, { ReactNode } from 'react';
import StoreHeaderWithLanguage from './StoreHeaderWithLanguage';
import StoreFooter from './StoreFooter';
import SocialMediaIcons from '../SocialMediaIcons';

type StoreLayoutProps = {
  children: ReactNode;
  hideFooter?: boolean;
};

const StoreLayout: React.FC<StoreLayoutProps> = ({ children, hideFooter }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeaderWithLanguage />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <StoreFooter />}
      {!hideFooter && <SocialMediaIcons />}
    </div>
  );
};

export default StoreLayout;
