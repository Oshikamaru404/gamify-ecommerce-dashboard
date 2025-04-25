
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tv } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F172A] to-[#111827] text-white perspective">
      <div className="text-center p-8 transform transition-all duration-700 hover:scale-105">
        <div className="flex justify-center mb-8 animate-bounce">
          <Tv className="h-24 w-24 text-[#0EA5E9] transform transition-all duration-500 hover:scale-110 hover:rotate-6" />
        </div>
        <h1 className="text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] animate-fade-in">
          BWIVOX <span className="text-white">IPTV</span>
        </h1>
        <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          Le service de streaming IPTV premium avec plus de 10 000 chaînes en direct,
          films et séries du monde entier en qualité HD et 4K.
        </p>
        <Button 
          asChild 
          className="px-10 py-7 text-xl bg-[#0EA5E9] hover:bg-[#0284C7] rounded-full transform transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] animate-fade-in"
        >
          <Link to="/">Découvrir nos offres</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
