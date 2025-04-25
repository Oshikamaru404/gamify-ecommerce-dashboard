
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tv } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F172A] to-[#111827] text-white">
      <div className="text-center p-8">
        <div className="flex justify-center mb-6">
          <Tv className="h-20 w-20 text-[#0EA5E9]" />
        </div>
        <h1 className="text-5xl font-extrabold mb-6">BWIVOX <span className="text-[#0EA5E9]">IPTV</span></h1>
        <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto">
          Le service de streaming IPTV premium avec plus de 10 000 chaînes en direct,
          films et séries du monde entier en qualité HD et 4K.
        </p>
        <Button asChild className="px-8 py-6 text-lg bg-[#0EA5E9] hover:bg-[#0284C7] rounded-full">
          <Link to="/">Découvrir nos offres</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
