
import React, { ReactNode } from 'react';
import StoreHeaderWithLanguage from './StoreHeaderWithLanguage';
import StoreFooter from './StoreFooter';
import SocialMediaIcons from '../SocialMediaIcons';

type StoreLayoutProps = {
  children: ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
  fullScreen?: boolean;
};

const StoreLayout: React.FC<StoreLayoutProps> = ({ children, hideFooter, hideHeader, fullScreen }) => {
  return (
    <div className={fullScreen ? 'flex h-[100dvh] flex-col overflow-hidden' : 'flex min-h-screen flex-col'}>
      {!hideHeader && <StoreHeaderWithLanguage />}
      <main className={fullScreen ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1'}>
        {children}
      </main>
      {!hideFooter && <StoreFooter />}
      {!hideFooter && <SocialMediaIcons />}
    </div>
  );
};

export default StoreLayout;
