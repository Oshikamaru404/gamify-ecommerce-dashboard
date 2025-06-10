
import React, { ReactNode } from 'react';
import StoreHeaderWithLanguage from './StoreHeaderWithLanguage';
import StoreFooter from './StoreFooter';

type StoreLayoutProps = {
  children: ReactNode;
};

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeaderWithLanguage />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
};

export default StoreLayout;
