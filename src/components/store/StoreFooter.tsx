
import React from 'react';
import { Link } from 'react-router-dom';

const StoreFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t bg-soft-gray">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">GamsGo</h3>
            <p className="text-sm text-muted-foreground">
              The best place to buy digital game codes and accounts for all platforms.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                  All Games
                </Link>
              </li>
              <li>
                <Link to="/products?platform=pc" className="text-muted-foreground hover:text-foreground">
                  PC Games
                </Link>
              </li>
              <li>
                <Link to="/products?platform=playstation" className="text-muted-foreground hover:text-foreground">
                  PlayStation
                </Link>
              </li>
              <li>
                <Link to="/products?platform=xbox" className="text-muted-foreground hover:text-foreground">
                  Xbox
                </Link>
              </li>
              <li>
                <Link to="/products?platform=nintendo" className="text-muted-foreground hover:text-foreground">
                  Nintendo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GamsGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
