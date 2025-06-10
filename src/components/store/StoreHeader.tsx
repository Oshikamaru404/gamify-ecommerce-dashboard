
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const StoreHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPanelDropdownOpen, setIsPanelDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFreeTrial = () => {
    const message = "Bonjour, je souhaite bénéficier de l'essai gratuit BWIVOX IPTV. Pouvez-vous m'aider?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
          
          {/* Panel Reseller Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsPanelDropdownOpen(true)}
            onMouseLeave={() => setIsPanelDropdownOpen(false)}
          >
            <button 
              className="flex items-center gap-1 text-lg font-semibold transition-colors hover:text-red-600"
              onClick={() => setIsPanelDropdownOpen(!isPanelDropdownOpen)}
            >
              Panel Reseller
              <ChevronDown size={16} className={cn("transition-transform", isPanelDropdownOpen && "rotate-180")} />
            </button>
            
            <div className={cn(
              "absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 transition-all duration-200",
              isPanelDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}>
              <Link 
                to="/activation" 
                className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                onClick={() => setIsPanelDropdownOpen(false)}
              >
                Activation Player
              </Link>
              <Link 
                to="/player-panel" 
                className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                onClick={() => setIsPanelDropdownOpen(false)}
              >
                Panel Player
              </Link>
            </div>
          </div>

          <Button 
            onClick={handleFreeTrial}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 text-lg"
          >
            <Zap className="mr-2" size={20} />
            Free Trial
          </Button>
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
          
          {/* Mobile Panel Reseller Section */}
          <div className="py-3">
            <div className="text-lg font-semibold text-gray-800 mb-2">Panel Reseller</div>
            <div className="ml-4 space-y-2">
              <Link
                to="/activation"
                className="block py-2 text-base text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Activation Player
              </Link>
              <Link
                to="/player-panel"
                className="block py-2 text-base text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel Player
              </Link>
            </div>
          </div>

          <Button 
            onClick={() => {
              handleFreeTrial();
              setIsMenuOpen(false);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold mt-2"
          >
            <Zap className="mr-2" size={20} />
            Free Trial
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default StoreHeader;
