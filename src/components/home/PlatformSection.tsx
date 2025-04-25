
import React from 'react';
import { Tv, Film, Video, Play, Laptop, Globe } from 'lucide-react';
import ServiceCategory from './ServiceCategory';

const PlatformSection = () => {
  const categories = [
    { icon: Tv, name: 'Chaînes Live', bgColor: 'bg-[#1A1F2C]', iconColor: 'text-[#0EA5E9]' },
    { icon: Film, name: 'Films', bgColor: 'bg-[#1E293B]', iconColor: 'text-[#8B5CF6]' },
    { icon: Video, name: 'Séries', bgColor: 'bg-[#1A1F2C]', iconColor: 'text-[#F97316]' },
    { icon: Play, name: 'Sports', bgColor: 'bg-[#1E293B]', iconColor: 'text-[#10B981]' },
    { icon: Laptop, name: 'VOD', bgColor: 'bg-[#1A1F2C]', iconColor: 'text-[#EC4899]' },
    { icon: Globe, name: 'International', bgColor: 'bg-[#1E293B]', iconColor: 'text-[#F59E0B]' }
  ];

  return (
    <div className="flex justify-center gap-6 py-10 px-4 overflow-x-auto">
      {categories.map((category) => (
        <ServiceCategory
          key={category.name}
          icon={category.icon}
          name={category.name}
          bgColor={category.bgColor}
          iconColor={category.iconColor}
        />
      ))}
    </div>
  );
};

export default PlatformSection;
