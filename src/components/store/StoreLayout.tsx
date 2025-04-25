
import React, { ReactNode } from 'react';
import { StoreProvider } from '@/contexts/StoreContext';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

type StoreLayoutProps = {
  children: ReactNode;
};

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col">
        <StoreHeader />
        <main className="flex-1">
          {children}
        </main>
        <StoreFooter />
      </div>
    </StoreProvider>
  );
};

export default StoreLayout;
