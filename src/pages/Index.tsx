
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tv, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#000000] text-white perspective">
      <div className="text-center p-8 transform transition-all duration-700 hover:scale-105">
        <div className="flex justify-center mb-8 animate-bounce">
          <Tv className="h-24 w-24 text-[#ff4d4d] transform transition-all duration-500 hover:scale-110 hover:rotate-6 drop-shadow-[0_0_15px_rgba(255,77,77,0.5)]" />
        </div>
        <div className="relative">
          <Star className="absolute -top-8 -right-4 h-12 w-12 text-[#ff4d4d] animate-pulse" />
          <h1 className="text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] animate-fade-in drop-shadow-[0_0_10px_rgba(255,77,77,0.3)]">
            BWIVOX <span className="text-white">IPTV</span>
          </h1>
        </div>
        <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          Le service de streaming IPTV premium avec plus de 10 000 chaînes en direct,
          films et séries du monde entier en qualité HD et 4K.
        </p>
        <Button 
          asChild 
          className="px-12 py-8 text-2xl bg-[#ff4d4d] hover:bg-[#ff6b6b] rounded-full transform transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,77,77,0.5)] animate-fade-in"
        >
          <Link to="/">Découvrir nos offres</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
