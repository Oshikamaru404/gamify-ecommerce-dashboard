
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { Input } from '@/components/ui/input';

const StoreHeader: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">GamsGo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          <form onSubmit={handleSearch} className="relative w-56">
            <Input
              type="search"
              placeholder="Search games..."
              className="h-9 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
            >
              <Search size={16} />
            </Button>
          </form>
        </nav>

        {/* Cart & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/admin" className="hidden md:block">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute left-0 right-0 top-16 z-50 border-b bg-background pb-4 pt-2 md:hidden",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <form onSubmit={handleSearch} className="mx-4 mb-4 flex">
          <Input
            type="search"
            placeholder="Search games..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="ghost" className="ml-2">
            <Search size={20} />
          </Button>
        </form>
        <nav className="flex flex-col space-y-4 px-4">
          <Link
            to="/"
            className="py-2 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="py-2 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/admin"
            className="py-2 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default StoreHeader;
