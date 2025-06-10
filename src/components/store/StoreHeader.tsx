
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StoreHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/subscription?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-lg">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-3xl font-bold">
            <span className="text-red-600">BWIVOX</span>
            <span className="text-gray-800"> IPTV</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          <Link to="/" className="text-lg font-semibold transition-colors hover:text-red-600">
            Home
          </Link>
          <Link to="/subscription" className="text-lg font-semibold transition-colors hover:text-red-600">
            Subscription IPTV
          </Link>
          <Link to="/activation" className="text-lg font-semibold transition-colors hover:text-red-600">
            Activation Player
          </Link>
          <Link to="/reseller" className="text-lg font-semibold transition-colors hover:text-red-600">
            Panel Reseller
          </Link>
          <Link to="/iptv-panel" className="text-lg font-semibold transition-colors hover:text-red-600">
            Panel IPTV
          </Link>
          <Link to="/player-panel" className="text-lg font-semibold transition-colors hover:text-red-600">
            Panel Player
          </Link>
          <Link to="/support" className="text-lg font-semibold transition-colors hover:text-red-600">
            Support
          </Link>
          <Link to="/how-to-buy" className="text-lg font-semibold transition-colors hover:text-red-600">
            How to Buy
          </Link>
          <Link to="/blog" className="text-lg font-semibold transition-colors hover:text-red-600">
            Blog
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 lg:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute left-0 right-0 top-20 z-50 border-b bg-white pb-4 pt-2 shadow-lg lg:hidden",
        isMenuOpen ? "block" : "hidden"
      )}>
        <nav className="flex flex-col space-y-4 px-4">
          <Link
            to="/"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/subscription"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Subscription IPTV
          </Link>
          <Link
            to="/activation"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Activation Player
          </Link>
          <Link
            to="/reseller"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Panel Reseller
          </Link>
          <Link
            to="/iptv-panel"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Panel IPTV
          </Link>
          <Link
            to="/player-panel"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Panel Player
          </Link>
          <Link
            to="/support"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Support
          </Link>
          <Link
            to="/how-to-buy"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            How to Buy
          </Link>
          <Link
            to="/blog"
            className="py-3 text-lg font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default StoreHeader;
